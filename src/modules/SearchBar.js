import {dispatch,event} from 'd3';

function SearchBar(){

	const _dis = dispatch('search:submit');
	
	function exports(selection){
		let datum = selection.datum() || [];

		//Build DOM for this module
        // <div class="form-group">
        //   <input type="text" class="form-control" placeholder="Search">
        // </div>
        // <button type="submit" class="btn btn-default">Submit</button>

        let input = selection.append('div')
        	.attr('class','form-group')
        	.append('input')
        	.attr('type','text')
        	.attr('class','form-control')
        	.attr('placeholder','Search for journalist');

        let submitButton = selection.append('button')
        	.attr('class','btn btn-default')
        	.attr('type','submit')
        	.text('Search');

        selection.on('submit',function(){
        	event.preventDefault(); //otherwise page will reload
        	console.log('SearchBar:'+input.node().value);
        	_dis.call('search:submit',null,input.node().value);
        });
	}

	exports.on = function(){
		_dis.on.apply(_dis,arguments);
		return this;
	}

	return exports;
}

export default SearchBar;