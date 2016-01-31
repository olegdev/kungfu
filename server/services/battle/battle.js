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

Service.prototype.createBattle = function(userModel, userModel2) {
	var me = this;

	var battle = battleFactory.factory(userModel, userModel2);
	me.battles[battle.id] = battle;

	this.api.pushStart(userModel, {side: 1, battle: this.battleAsJson(battle.id)});
	this.api.pushStart(userModel2, {side:2, battle: this.battleAsJson(battle.id)});
}

Service.prototype.battleAsJson = function(battleId) {
	var me = this,
		battle = me.battles[battleId];
	if (battle) {
		return {
			id: battle.id,
			fieldSize: battle.fieldSize,
			side1: {
				u: battle.side1.u.get('info;stats;'),
				letters: battle.side1.letters,
			},
			side2: {
				u: battle.side2.u.get('info;stats;'),
				letters: battle.side2.letters,
			}
		}
	} else {
		return {};
	}
}

// Создает только один экземпляр класса
Service.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();