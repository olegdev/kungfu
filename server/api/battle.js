/**
 * API боя
 */
var socketsService = require(SERVICES_PATH + '/sockets');

var API = function() {
	var me = this;

	me.service = require(SERVICES_PATH + '/battle/battle');
	me.service.api = me;

	me.channel = socketsService.createChannel('battle');
	me.channel.on('get_battle', me.cmdGetBattle, me);
	me.channel.on('word', me.cmdWord, me);

	me.errorChannel = socketsService.createChannel('error');
}

//============== API commands ==============

API.prototype.cmdGetBattle = function(userModel, data, callback) {
	var me = this,
		battle = me.service.getBattleById(userModel.get('bindings', 'battle'));
	if (battle) {
		callback({battle: battle.asJson()});
	} else {
		me.errorChannel.push(userModel.id, 'error', {msg: 'Battle not found'});
	}
}

API.prototype.cmdWord = function(userModel, data) {
	this.service.onUserWord(userModel, data);
}

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