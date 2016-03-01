/**
 * Восстанавливаемые характеристики
 */
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var mongoose = require("mongoose");
var _ = require("underscore");

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

Addon.prototype.init = function() {
	this.set('energy', [5,5,1]);
}

Addon.prototype.getConfig = function() {
	return this.model.get('timed');
}

Addon.prototype.get = function(key) {
	var me = this,
		data = me.model.get('timed');
	return key ? data[key] : data;
}

Addon.prototype.set = function(key, value) {
	var me = this,
		data = me.model.get('timed');
	data[key] = value;	
	me.model.set('timed', _.clone(data));
}

module.exports = Service;