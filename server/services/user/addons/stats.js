/**
 * Статы (key-value хеш)
 */
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var mongoose = require("mongoose");
var _ = require('underscore');

var Service = {
	factory: function(model) {
		return new Addon(model);
	}
}

/**
 * Класс аддона
 */
var Addon = function(model) {
	this.model = model;
}

Addon.prototype.getConfig = function() {
	return this.model.get('stats');
}

Addon.prototype.get = function(key) {
	var me = this,
		data = me.model.get('stats');
	return key ? data[key] : data;
}

Addon.prototype.set = function(key, value) {
	var me = this,
		data = me.model.get('stats');
	data[key] = value;	
	me.model.set('stats', _.clone(data));
}

module.exports = Service;