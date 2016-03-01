/**
 * Авторизационные данные
 */
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var mongoose = require("mongoose");

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
	//
}

Addon.prototype.getConfig = function() {
	//
}

Addon.prototype.get = function(key) {
	var me = this,
		data = me.model.get('auth');
	return key ? data[key] : data;
}

module.exports = Service;