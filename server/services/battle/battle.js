/**
 * Сервис боя
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

var battleFactory = require(SERVICES_PATH + '/battle/battle_factory')

var Service = function() {
	var me = this;
	me.battles = {}; // ссылки на текущие бои; ключем является id боя
}

Service.prototype.getBattleById = function(battleId) {
	return this.battles[battleId];
}

Service.prototype.createBattle = function(userModel, userModel2) {
	var me = this;

	var battle = battleFactory.factory(userModel, userModel2);
	me.battles[battle.id] = battle; 

	userModel.set('bindings', 'battle', battle.id);
	userModel2.set('bindings', 'battle', battle.id);

	me.api.pushStart(userModel, {battle: me.battleAsJson(battle.id)});
	me.api.pushStart(userModel2, {battle: me.battleAsJson(battle.id)});
}

Service.prototype.battleAsJson = function(battleId) {
	var me = this,
		battle = me.battles[battleId];
	if (battle) {
		return battle.asJson();
	} else {
		return {};
	}
}

Service.prototype.onUserWord = function(userModel, data) {
	var me = this,
		battleId = userModel.get('bindings', 'battle');
}

// Создает только один экземпляр класса
Service.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();