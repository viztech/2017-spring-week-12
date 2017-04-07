import {csv,dispatch} from 'd3';

function Dataloader(){
	const _dis = dispatch('dataloaded','dataloaderror');

	function exports(){
	}

	exports.load = function(url,parse){
		csv(url,parse,function(err,data){
			if(err){
				_dis.call('dataloaderror',null,err);
			}else{
				_dis.call('dataloaded',null,data);
			}
		});
		return this;
	}

	exports.on = function(){
		_dis.on.apply(_dis,arguments);
		return this;
	}

	return exports;
}

const dataloader = Dataloader(); //dataloader == exports
dataloader
	.load('./data/cpj2017_link_0322.csv', function(d){
		return {
			name:d['Name'],
			where:d['Country_killed']
		}
	});

export default dataloader; //What did we export?
