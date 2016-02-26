/**
 * Рейтинг игрока (лига, кол-во очков)
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

Addon.prototype.getConfig = function() {
	return this.get();
}

Addon.prototype.get = function(key) {
	var me = this,
		data = me.model.get('rating');
	return key ? data[key] : data;
}

Addon.prototype.set = function(key, value) {
	var me = this,
		data = me.model.get('rating');
	data[key] = value;	
	me.model.set('rating', _.clone(data));
}

Addon.prototype.addPoints = function(points) {
	var me = this;
	me.set('points', Math.max(me.get('points') + points,0));
}

module.exports = Service;