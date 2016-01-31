/**
 * API боя
 */
var socketsService = require(SERVICES_PATH + '/sockets');

var API = function() {
	var me = this;

	me.service = require(SERVICES_PATH + '/battle/battle');
	me.service.api = me;

	me.channel = socketsService.createChannel('battle');
	// me.channel.on('search', me.cmdSearch, me);
	// me.channel.on('cancel', me.cmdCancel, me);
}

//============== API commands ==============

API.prototype.pushStart = function(userModel, data) {
	this.channel.push(userModel.id, 'start', data);
}

// Создает только один экземпляр класса
API.getInstance = function(){
    if (!this.instance) {
    	this.instance = new API();
    }
    return this.instance;
}

module.exports = API.getInstance();