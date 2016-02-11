/**
 * Поиск противника
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

var battleService = require(SERVICES_PATH + '/battle/battle');

var Service = function() {
	var me = this;
	this.queue = [];
	this.interval = setInterval(function() {
		me.checkQueue();
	}, 1000);
}

Service.prototype.checkQueue = function() {
	var me = this;
	if (me.queue.length > 1) {
		for(var i = 0; i < me.queue.length; i+=2) {
			if (me.queue[i] && me.queue[i+1]) {
				me.api.pushEnemy(me.queue[i], me.queue[i+1]);
				me.api.pushEnemy(me.queue[i+1], me.queue[i]);
				battleService.createBattle(me.queue[i], me.queue[i+1]);
			}
		}
		if (i > 0) {
			me.queue = me.queue.slice(i, me.queue.length);
		}
	}
}

Service.prototype.search = function(userModel) {
	var me = this,
		alreadyQueued = false;
	for(var i = 0; i < this.queue.length; i++) {
		if (this.queue[i].id == userModel.id) {
			alreadyQueued = true;
			break;
		}
	}
	if (!alreadyQueued) {
		this.queue.push(userModel);
	}
}

Service.prototype.cancel = function(userModel) {
	for(var i = 0; i < this.queue.length; i++) {
		if (this.queue[i].id == userModel.id) {
			this.queue.splice(i, 1);
			break;
		}
	}
}

// Создает только один экземпляр класса
Service.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();