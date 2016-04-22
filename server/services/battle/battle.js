/**
 * Сервис боя
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

var dictionary = require(SERVICES_PATH + '/dictionary/dictionary');
var rating = require(SERVICES_PATH + '/rating/rating');
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

	battle.on('round', _.bind(me.onBattleRound, me));
	battle.on('finish', _.bind(me.onBattleFinish, me));

	me.api.pushStart(userModel, {battle: battle.asJson()});
	me.api.pushStart(userModel2, {battle: battle.asJson()});
}

Service.prototype.onHit = function(userModel, data, callback) {
	var me = this,
		battleId = userModel.get('bindings', 'battle'),
		battle = me.battles[battleId],
		side, word = '',

		innerCompactAndGetColumns = function(letters) {
			var columns = [];
			
			for(var i = 0; i < battle.fieldSize.columns; i++) {
				columns.push(new Array(battle.fieldSize.rows));
			}

			_.each(letters, function(item) {
				columns[item.column][item.row] = item;
			});

			for(var i = 0; i < battle.fieldSize.columns; i++) {
				columns[i] = _.compact(columns[i]);
			}

			return columns;
		},

		innerFillSrc = function(letters) {
			var columns = innerCompactAndGetColumns(letters),
				column, id;

			// смещаю буквы в колонках вниз, если есть свободное поле
			for(var i = 0; i < battle.fieldSize.columns; i++) {
				column = columns[i];
				for(var j = 0; j < column.length; j++) {
					column[j].row = j;
					column[j].column = i;
				}
			}

			// генерирую случайную букву, если в первых двух строках свободное место
			for(var i = 0; i < battle.fieldSize.columns; i++) {
				if (columns[i].length == 0) {
					id = battle._genLocalId('ltr');
					letters[id] = {
						id: id,
						row: 0,
						column: i,
						letter: dictionary.generateLetter(letters, 0),
					};
					id = battle._genLocalId('ltr');
					letters[id] = {
						id: id,
						row: 1,
						column: i,
						letter: dictionary.generateLetter(letters, 1),
					};
				} else if (columns[i].length == 1) {
					id = battle._genLocalId('ltr');
					letters[id] = {
						id: id,
						row: 1,
						column: i,
						letter: dictionary.generateLetter(letters, 1),
					};
				}
			}
		},

		innerFillDest = function(letters, word) {
			var columns = innerCompactAndGetColumns(letters),
				index = 0, id, letter, freeCells = [],

				getFreeCells = function() {
					var cells = [], rowIndex = 2;
					while(!cells.length && rowIndex < battle.fieldSize.rows) {
						for(var i = 0; i < columns.length; i++) {
							if (!columns[i][rowIndex]) {
								cells.push({row: rowIndex, column: i});
							}
						}
						rowIndex++;
					}
					return cells;
				}

			word = dictionary.mixWord(word);
			freeCells = getFreeCells();

			while(freeCells.length && index < word.length) {
				var cell = freeCells[_.random(0, freeCells.length-1)];
				id = battle._genLocalId('ltr');
				letters[id] = {
					id: id,
					row: cell.row,
					column: cell.column,
					letter: word.charAt(index++),
				};
				columns[cell.column][cell.row] = letters[id];
				freeCells = getFreeCells();
			}

			return freeCells.length == 0;
		},

		innerFillLastHit = function(letters, word) {
			var columns = innerCompactAndGetColumns(letters);

			for(var i = 0; i < Math.min(word.length,6); i++) {
				var id = columns[i][columns[i].length-1].id;
				var tmp = letters[id];
				var newId = battle._genLocalId('ltr');
				letters[newId] = {
					id: newId,
					row: tmp.row,
					column: tmp.column,
					letter: word.charAt(i),
				}
				delete letters[id];
			}
		}

	if (battle) {
	
		if (battle.sides[0].u.id == userModel.id) {
			side = battle.sides[0];
		} else {
			side = battle.sides[1];
		}

		// проверка слова
		data.word.forEach(function(item) {
			if (side.letters[item.id]) {
				word += side.letters[item.id].letter;
			}
		});

		if (word.length == data.word.length) {
			if (dictionary.hasWord(word)) {
				battle.addHit(userModel, data);
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

Service.prototype.onBattleRound = function(battle) {
	this.api.pushRound(battle.sides[0].u, {battle: battle.asJson()});
	this.api.pushRound(battle.sides[1].u, {battle: battle.asJson()});
}

Service.prototype.onBattleFinish = function(battle) {
	var me = this;

	// прибиваю объект боя
	delete me.battles[battle.id];

	rating.finishBattle(battle, function(err, result) {
		me.api.pushFinish(battle.sides[0].u, {
			battle: battle.asJson(),
			user: battle.sides[0].u.asJson('info;counters;bindings;timed;buffs;rating'),
			result: result,
		});
		me.api.pushFinish(battle.sides[1].u, {
			battle: battle.asJson(),
			user: battle.sides[1].u.asJson('info;counters;bindings;timed;buffs;rating'),
			result: result,
		});
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