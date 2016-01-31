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

Addon.prototype.getConfig = function() {
	//
}

Addon.prototype.get = function(fields) {
	var me = this,
		data = me.model.get('auth'),
		result = {};

	if (fields && fields.length) {
		fields.forEach(function(field) {
			result[field] = data[field];
		});
	} else {
		result = data;
	}

	return result;
}

module.exports = Service;