/**
 * Работа с юзером
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var mongoose = require("mongoose");

var userModel = require(SERVICES_PATH + '/user/usermodel');

var Service = function() {
	this.safeQueue = {};
}

Service.prototype.findById = function(uid, callback) {
	mongoose.model('users').findById(uid, function(err, user) {
		if (err) {
			callback(error.factory('user', 'findById', 'DB error ' + err, logger));
		} else {
			if (user) {
				callback(null, userModel.factory(user));
			} else {
				callback(null, false);
			}
		}
	});
}

Service.prototype.safe = function(userModel, fn) {
	var me = this,
		queue = me.safeQueue[userModel.id],

		execQueue = function(queue, callback) {
			var me = this;

				next = function() {
					var fn = queue[0];
					fn(function() {
						queue.shift();
						if (queue.length) {
							next();
						} else {
							callback();
						}
					});
				};

			if (queue && queue.length) {
				next();
			}
		};

	if (!queue) {
		queue = me.safeQueue[userModel.id] = [fn];
	} else {
		me.safeQueue[userModel.id].push(fn);
	}
	if (me.safeQueue[userModel.id].length == 1) {
		execQueue(queue, function() {
			me.safeQueue[userModel.id] = undefined;
		});
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