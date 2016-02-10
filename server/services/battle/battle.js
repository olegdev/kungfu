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
		hit,
		word = '',

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
					id = battle.genLocalId('ltr');
					letters[id] = {
						id: id,
						row: 0,
						column: i,
						letter: dictionary.getRandomLetter(),
					};
					id = battle.genLocalId('ltr');
					letters[id] = {
						id: id,
						row: 1,
						column: i,
						letter: dictionary.getRandomLetter(),
					};
				} else if (columns[i].length == 1) {
					id = battle.genLocalId('ltr');
					letters[id] = {
						id: id,
						row: 1,
						column: i,
						letter: dictionary.getRandomLetter(),
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
				id = battle.genLocalId('ltr');
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
		}

	if (battle) {

		// определяю данные сторон (сторона 1 - отправитель, 2- получатель)
		if (battle.sides[0].u.id == userModel.id) {
			side1 = battle.sides[0];
			side2 = battle.sides[1];
		} else {
			side1 = battle.sides[1];
			side2 = battle.sides[0];
		}
	
		// проверка слова
		data.word.forEach(function(item) {
			if (side1.letters[item.id]) {
				word += side1.letters[item.id].letter;
			}
		});

		if (word.length == data.word.length) {
			if (dictionary.hasWord(word)) {
				
				// обновляю состояние источника
				side1.isFull = false;
				data.word.forEach(function(item) {
					delete side1.letters[item.id];
				});
				innerFillSrc(side1.letters);

				// обновляю состояние получателя
				if (side2.isFull) {
					side2.isFinished = true;
				} else {
					side2.isFull = innerFillDest(side2.letters, word);
				}

				// рассылаю данные на клиент
				hit = {
					index: ++battle.hitIndex,
					owner_id: userModel.id,
					src: side1.letters,
					dest: side2.letters,
					finished: side2.isFinished,
				}
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