import * as d3 from 'd3';

import dataloader from './modules/dataloader';
import Menu from './modules/Menu';
import graphic from './modules/graphic';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

//Create instances of all modules (views)
//Not needed for Dataloader, since an instance has already been exported
const menu = Menu();
const globalDispatch = d3.dispatch('search');

//Load data
//Once loaded, populate all modules
dataloader
	.on('dataloaded',function(data){
		//Once dataloaded, populate modules
		d3.select('.navbar').datum(data).call(menu); //menu module
		d3.select('.plot').datum(data).call(graphic); //graphic module --> force layout
	});

//Event architecture: event emitters
menu
	.on('arrangeBy:all',function(){})
	.on('arrangeBy:country',function(){})
	.on('search',function(val){ 
		globalDispatch.call('search',null,val);
	});

//Event architecture: event receivers
globalDispatch.on('search',function(name){
	//parameter 'val' is the input value from the SearchBar module
	graphic.find(name);
});
