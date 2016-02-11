/**
 * Рейтинг
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

// var battleService = require(SERVICES_PATH + '/battle/battle');

var Service = function() {
	var me = this;
	//
}

Service.prototype.finishBattle = function(battle, callback) {
	var me = this,
		stats,
		result = {
			battle: battle.asJson()
		};

	// прибиваю ссылки на бой
	battle.sides[0].u.set('bindings', 'battle', null);
	battle.sides[1].u.set('bindings', 'battle', null);

	// обновляю статы участников
	if (battle.sides[0].isWin) {
		battle.sides[0].u.set('stats', 'wins', battle.sides[0].u.get('stats', 'wins') + 1);
		battle.sides[1].u.set('stats', 'loses', battle.sides[1].u.get('stats', 'loses') + 1);
	} else {
		battle.sides[1].u.set('stats', 'wins', battle.sides[1].u.get('stats', 'wins') + 1);
		battle.sides[0].u.set('stats', 'loses', battle.sides[0].u.get('stats', 'loses') + 1);
	}

	// сохраняю изменения
	battle.sides[0].u.model.save(function(err) {
		if (!err) {
			battle.sides[1].u.model.save(function(err) {
				if (!err) {
					callback(null, result);
				} else {
					callback(error.factory('rating', 'finishBattle', err, logger));
				}
			});
		} else {
			callback(error.factory('rating', 'finishBattle', err, logger));
		}
	});

}

// Создает только один экземпляр класса
Service.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();