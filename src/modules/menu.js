import {dispatch,event} from 'd3';

import SearchBar from './SearchBar.js';

function Menu(){

	const _dis = dispatch('arrangeBy:all','arrangeBy:country','search');

	function exports(selection){
		const datum = selection.datum() || [];

		//Two parts to the menu
		//Part 1: buttons that allow us to toggle between modes
		selection.append('span')
			.attr('class','navbar-brand')
			.text('Arrange by: ');
		let buttons = selection.append('ul')
			.attr('class','nav navbar-nav');
		buttons.append('li')
			.attr('class','active')
			.append('a')
			.attr('href','#')
			.on('click',function(){
				event.preventDefault();
				_dis.call('arrangeBy:all');
			})
			.text('All Journalists');
		buttons.append('li')
			.append('a')
			.attr('href','#')
			.on('click',function(){
				event.preventDefault();
				_dis.call('arrangeBy:country');
			})
			.text('By Country');

		//Part 2: a search bar
		//Created in a different module!
		let searchBar = SearchBar();
		searchBar.on('search:submit', function(val){
			_dis.call('search',null,val);
		});

		selection.append('form')
			.attr('class','navbar-form navbar-left')
			.datum(datum)
			.call(searchBar);
	}

	exports.on = function(){
		_dis.on.apply(_dis,arguments);
		return this;
	}

	return exports;
}

export default Menu;