import * as d3 from 'd3';

import dataloader from './modules/dataloader';
import Menu from './modules/menu';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

//Create instances of all modules (views)
//Not needed for Dataloader, since an instance has already been exported
const menu = Menu();

//Load data
//Once loaded, populate all modules
dataloader
	.on('dataloaded',function(data){
		//Once dataloaded, populate modules
		d3.select('.navbar').datum(data).call(menu);
	});

//Event architecture: event emitters
menu
	.on('arrangeBy:all',function(){})
	.on('arrangeBy:country',function(){})
	.on('search',function(val){ console.log('Index:'+val);})

//Event architecture: event receivers
