/**
 * Рейтинг
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

var leagueRef = require(SERVICES_PATH + '/references/leagues/leagues');

// var battleService = require(SERVICES_PATH + '/battle/battle');

var Service = function() {
	var me = this;
	//
}

Service.prototype.finishBattle = function(battle, callback) {
	var me = this,
		result = {
			battle: battle.asJson()
		},
		winUser, loseUser,
		points;

	// прибиваю ссылки на бой
	battle.sides[0].u.set('bindings', 'battle', null);
	battle.sides[1].u.set('bindings', 'battle', null);

	if (battle.sides[0].isWin) {
		winUser = battle.sides[0].u;
		loseUser = battle.sides[1].u;
	} else {
		winUser = battle.sides[1].u;
		loseUser = battle.sides[0].u;
	}

	// обновляю счетчики
	winUser.addons.counters.incValue('wins');
	loseUser.addons.counters.incValue('loses');

	// рейтинг
	points = me.calcPoints(winUser, loseUser);
	winUser.addons.rating.addPoints(points);
	loseUser.addons.rating.addPoints(-points);

	result.points = points;

	// лига
	if (me.maybeNewLeague(winUser)) {
		result.league = winUser.get('rating', 'league');
	}

	// сохраняю изменения
	winUser.model.save(function(err) {
		if (!err) {
			loseUser.model.save(function(err) {
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

Service.prototype.calcPoints = function(u1, u2) {
	var me = this,
		leagueIndex = u1.get('rating', 'league'),
		leagueInfo = leagueRef.getLeagueByIndex(leagueIndex),
		u1Points = u1.get('rating', 'points'),
		u2Points = u2.get('rating', 'points');

	return parseInt(leagueInfo.delta / leagueInfo.fight_count + (u2Points - u1Points) / leagueInfo.fight_count);
}

Service.prototype.maybeNewLeague = function(u) {
	var me = this,
		leagueIndex = u.get('rating', 'league'),
		leagueMaxPoints = leagueRef.getLeagueByIndex(leagueIndex).points,
		nextLeague = leagueRef.getNextLeague(leagueIndex),
		currentPoints = u.get('rating', 'points');

	if (nextLeague && currentPoints > leagueMaxPoints) {
		u.set('rating', 'league', nextLeague.index);
		return true;
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