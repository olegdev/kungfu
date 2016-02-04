/**
 * Сервис боя
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

var dictionary = require(SERVICES_PATH + '/dictionary/dictionary');
var battleFactory = require(SERVICES_PATH + '/battle/battle_factory')
var messages = require(SERVICES_PATH + '/references/messages/messages');

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

Service.prototype.onWord = function(userModel, data, callback) {
	var me = this,
		battleId = userModel.get('bindings', 'battle'),
		battle = me.battles[battleId],
		side1, side2,
		hit = {
			ownerId: userModel.id,
			src: [],
			dest: [],
		},
		word = '';

	if (battle) {

		if (battle.sides[0].u.id == userModel.id) {
			side1 = battle.sides[0];
			side2 = battle.sides[1];
		} else {
			side1 = battle.sides[1];
			side2 = battle.sides[0];
		}
	
		data.word.forEach(function(item) {
			var cellIndex = item.index.split(' ');
			if (side1.field[cellIndex[0]][cellIndex[1]]) {
				word += side1.field[cellIndex[0]][cellIndex[1]].letter;
			}
		});

		if (word.length == data.word.length) {
			if (dictionary.hasWord(word)) {
				
				// обновляю состояние источника
				data.word.forEach(function(item) {
					var cellIndex = item.index.split(' ');
					if (cellIndex[0] == 0 || cellIndex[0] == 1) {
						side1.field[cellIndex[0]][cellIndex[1]].letter = dictionary.getRandomLetter();
					} else {
						side1.field[cellIndex[0]][cellIndex[1]].letter = undefined;
					}
					hit.src.push(side1.field[cellIndex[0]][cellIndex[1]]);
				});
				side1.isFull = false;

				// обновляю состояние получателя
				word = dictionary.mixWord(word);
				if (side2.isFull) {
					side2.isFinished = true;
				} else {
					for(var i = 2, done; i < side2.field.length && !done; i++) {
						for(var j = 0; j < side2.field[i].length && !done; j++) {
							if (!side2.field[i][j].letter) {
								side2.field[i][j].letter = word.charAt(hit.dest.length);
								hit.dest.push(side2.field[i][j]);
								if (word.length == hit.dest.length) {
									done = true;
								}
							}
						}	
					}
					if (i == side2.field.length && j == side2.field[i-1].length) {
						side2.isFull = true;
					}
				}

				if (side2.isFinished) {
					hit.finished = true;
				}

				// рассылаю данные на клиент
				me.api.pushHit(side1.u, {hit: hit});
				me.api.pushHit(side2.u, {hit: hit});

				callback(null);
			} else {
				callback(messages.getByKey('msg_word_not_found'));
			}	
		} else {
			callback(messages.getByKey('msg_invalid_params'));
		}
	} else {
		callback(messages.getByKey('msg_not_active_battle'));
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