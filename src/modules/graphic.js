import * as d3 from 'd3';

import loadLink from './loadLink';

function Graphic(){

	let W,
		H,
		m = {t:30,r:30,b:30,l:30},
		r = 4,
		canvas,
		ctx,
		canvasMouseTarget,
		ctxMouseTarget,
		force;
	const _dis = d3.dispatch('find');


	function exports(selection){
		let datum = selection.datum() || [];

		selection.style('position','relative');

		//Build DOM from selection
		W = selection.node().clientWidth;
		H = selection.node().clientHeight;

		//Canvas for displaying main force layout
		canvas = selection.select('.canvas-main').size()===0? selection.append('canvas').attr('class','canvas-main') : selection.select('.canvas-main'); //does selection currently contain <canvas>? If not, append new <canvas> element and return selection
		canvas.attr('width',W).attr('height',H);
		ctx = canvas.node().getContext('2d');

		//Canvas for displaying mouse interaction
		canvasMouseTarget = selection.select('.canvas-mouse-target').size()===0? selection.append('canvas').attr('class','canvas-mouse-target') : selection.select('.canvas-mouse-target'); //does selection currently contain <canvas>? If not, append new <canvas> element and return selection
		canvasMouseTarget
			.attr('width',W).attr('height',H)
			.style('position','absolute')
			.style('top','0px').style('left','0px');
		ctxMouseTarget = canvasMouseTarget.node().getContext('2d');

		//Tooltip



		//Configure or re-configure force layout
		//Add forces
		const x = d3.forceX().strength(.005),
			y = d3.forceY().strength(.005),
			collide = d3.forceCollide(r);
		force = d3.forceSimulation(datum)
			.force('collide',collide)
			.force('x',x)
			.force('y',y)
			.on('tick',_tick);

		//Mouse interaction
		canvasMouseTarget
			.on('mousemove',function(){
				let xy = d3.mouse(this);
				//Use the xy coordinates to find the nearest node in the simulation
				if(_findNearestNode(xy)){
					let nearest = _findNearestNode(xy);
					_highlight(nearest);
				}
			});

		//Interact with external scope
		_dis.on('find',function(name){
			console.log('graphic:find:'+name);
			let found = force.nodes().filter(function(d){return d.name === name})[0];
			if(found){
				_highlight(found);
			}
		});
	}

	exports.find = function(name){
		//name --> journalist name
		_dis.call('find',null,name);
	}

	//Internal function _tick
	//Run for each "tick" of the force simulation
	//And on each "tick" redraw canvas
	function _tick(){
		//Note: the "this" context within the 'tick' event listener is the forceSimulation itself
		let nodes = this.nodes(); //this.nodes() === force.nodes()

		//On each tick/update of the simulation, repaint canvas
		_redraw(nodes);
	}

	//Redraw canvas
	function _redraw(nodes){
		ctx.clearRect(0,0,W,H);

		ctx.save();
		ctx.translate(W/2,H/2);

		ctx.beginPath();
		nodes.forEach(function(n){
			ctx.moveTo(n.x+r,n.y);
			ctx.arc(n.x,n.y,r,0,Math.PI*2);
		});
		ctx.stroke();
		ctx.fill();

		ctx.restore();
	}

	//Internal function _findNearestNode
	//Finds nearest node in the force simulation based on x,y coordinates
	function _findNearestNode(xy){
		return force.find(xy[0]-W/2, xy[1]-H/2, r*5);
	}

	//Internal function _highlight
	//Given a particular node in the force layout, highlight it
	function _highlight(node){
		ctxMouseTarget.clearRect(0,0,W,H);

		ctxMouseTarget.save();
		ctxMouseTarget.translate(W/2,H/2);

		ctxMouseTarget.beginPath();
		ctxMouseTarget.moveTo(node.x+r+1,node.y);
		ctxMouseTarget.arc(node.x,node.y,r+3,0,Math.PI*2);

		ctxMouseTarget.fillStyle = 'red';
		ctxMouseTarget.fill();

		ctxMouseTarget.restore();
	}

	return exports;
}

const graphic = Graphic();

export default graphic;