/**
 * API онлайн листа
 */
var socketsService = require(SERVICES_PATH + '/sockets');
var onlinelistService = require(SERVICES_PATH + '/onlinelist/onlinelist');

var API = function() {
	var me = this;

	me.channel = socketsService.createChannel('onlinelist');
	me.channel.on('get_online', me.cmdGetOnlineList, me);
}

//============== API commands ==============

API.prototype.cmdGetOnlineList = function(userModel, params, callback) {
	var me = this,
		list = [];

	Object.keys(onlinelistService.list).forEach(function(uid) {
		list.push(onlinelistService.list[uid].asJson('info;counters;'));
	});

	callback(list);
}

// Создает только один экземпляр класса
API.getInstance = function(){
    if (!this.instance) {
    	this.instance = new API();
    }
    return this.instance;
}

module.exports = API.getInstance();