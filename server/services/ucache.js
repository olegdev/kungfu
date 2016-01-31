/**
 * Кеш юзера (персональный)
 */
 
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);

var CacheClass = function() {
	this.cache = {};
}

// Создает только один экземпляр класса
CacheClass.getInstance = function(){
    if (!this.instance) {
    	this.instance = new CacheClass();
    	/***/ logger.info('cache created');
    }
    return this.instance;
}

CacheClass.prototype.set = function(uid, prop, value) {
	if (arguments.length == 2) {
		this.cache[uid] = prop;
	} else {
		this.setProp.apply(this, arguments);
	}
}

CacheClass.prototype.get = function(uid, prop, value) {
	if (arguments.length == 2) {
		return this.cache[uid];
	} else {
		return this.getProp.apply(this, arguments);
	}
}

CacheClass.prototype.setProp = function(uid, prop, value) {
	var data = this.cache[uid];
	if (data) {
		data[prop] = value;
	} else {
		/***/ logger.error('write error, cache not found');
	}
}

CacheClass.prototype.getProp = function(uid, prop) {
	var data = this.cache[uid];
	if (data) {
		data[prop] = value;
	} else {
		/***/ logger.error('read error, cache not found');
	}
}
 
module.exports = CacheClass.getInstance();