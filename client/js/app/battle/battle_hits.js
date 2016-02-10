/**
 * Модуль обработки ударов. 
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',
], function($, _, Backbone, sockets) {

	var queue = [],
		lastHitIndex,
		interval,
		battleViewContainer;

	var startMonitor = function() {
		interval = setInterval(function() {
			if (queue.length && canShowHit(queue[0])) {
				showHit(queue.shift());
			}
		}, 100);
	}

	var stopMonitor = function() {
		clearInterval(interval);
	}
	
	var canShowHit = function(data) {
		return !battleViewContainer.isBusy;
	}

	var showHit = function(data) {
		battleViewContainer.showHit(data);
	}

	return {
		init: function(battleViewContainerInstance) {
			queue = [];
			lastHitIndex = undefined;
			battleViewContainer = battleViewContainerInstance;
			battleViewContainer.on('destroy', function() {
				stopMonitor();
			});
			startMonitor();
		},
		processHit: function(data) {
			if (!lastHitIndex || lastHitIndex +1 == data.hitIndex) {
				lastHitIndex = data.hitIndex;
				queue.push(data);	
			} else if (lastHitIndex < data.hitIndex) {
				setTimeout(function() {
					this.processHit(data);
				}, 1000);
			} else {
				// ignore
			}
		}
	};
});