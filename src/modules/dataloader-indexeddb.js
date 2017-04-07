//FIXME: IndexDB retrieval is currently slower than csv load/parse!!!

import {csv} from 'd3';

//Temp
let parse = (d)=>{return d;};
let url = './data/hubway_trips_reduced.csv';
//Temp

const config = {
	db: 'hubway'
};

function openDB(db){
	let dbPromise = new Promise((resolve,reject)=>{
		if(window.indexedDB){
			let request = window.indexedDB.open(db);

			request.onupgradeneeded = (event)=>{
				event.target.result.createObjectStore(url,{autoIncrement:true});
			}
			request.onsuccess = (event)=>{ window.db = event.target.result; resolve(event.target.result); }
			request.onerror = (event)=>{ reject(new Error(request.error)); }
		}else{
			reject(new Error('IndexedDB is not supported'));
		}
	});

	return dbPromise;
}

function getObjectStore(store){
	return function(db){
		if(db.objectStoreNames.length === 0 || !db.objectStoreNames.contains(store)){
			return Promise.reject(new Error(`objectStore ${store} not in db ${db}`));
		}else{
			let objStore = db
				.transaction([store],'readwrite') //IDBTransaction
				.objectStore(store); //IDBObjectStore
			
			return Promise.resolve(objStore);
		}
	}
}

function retrieveValues(objStore){

	//FIXME
	objStore.transaction.oncomplete = ()=>{console.log('transaction is finished')}

	return new Promise((resolve,reject)=>{
		let request = objStore.getAll();
		request.onerror = ()=>{ 
			console.log(request.error);
			reject(new Error('Error requesting from objectStore')); }
		request.onsuccess = ()=>{
			if(request.result.length===0){
				reject(objStore);
			}else{
				console.log('Retrieved non-empty values from IndexedDB');
				resolve(request.result);
			}
		}
	});
}

function handleException(e){
	if(e instanceof Error){
		//Issue with connecting to IndexedDB, or connecting objectStore
		console.log(e.message, 'Load CSV');
		return loadCSV(url,parse);
	}else{
		//Empty objectStore "e"; populate and parse
		console.log('Load CSV and populate IndexedDB');

		//FIXME: opening a new transaction
		//window.objStore = window.db.transaction([url],'readwrite').objectStore(url);
		//e.put({name:'siqi'});

		return loadCSV(url,(d)=>{
			return parse(d);		
		}).then((rows)=>{
			let objStore = window.db.transaction([url],'readwrite').objectStore(url);
			rows.forEach((row)=>{ objStore.put(row);});
			return rows;
		})
	}
}

function loadCSV(_url,_parse){
	return new Promise((resolve,reject)=>{
		csv(_url,_parse,(err,rows)=>{
			if(err) reject(err);
			resolve(rows);
		});
	})
}

openDB(config.db)
	.then(getObjectStore(url))
	.then(retrieveValues)
	.catch(handleException);