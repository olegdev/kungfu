/**
 * Зарница
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var user = require(SERVICES_PATH + '/user/user');
var _ = require('underscore');

var Service = function() {
	this.game = null;
}

Service.prototype.hasGame = function() {
	return this.game != null;
}

Service.prototype.getGame = function() {
	return this.game;
}

Service.prototype.createGame = function(userModel) {
	this.game = {
		field: {
			size: config.fieldSize,
			letters: this.fillField(config.fieldSize),
		},
		creator: {
			uid: userModel.id,
			login: userModel.model.get('auth.login'),
			letters: [],
			level: 1,
			levels: {}
		},
		goal: config.letters[_.random(0, config.letters.length-1)]
	}
	return this.game;
}

Service.prototype.createLevel = function(uid) {
	if (uid == this.game.creator.uid) {
		++this.game.creator.level;
		if (this.game.opponent.levels[this.game.creator.level]) {
			this.game.creator.levels[this.game.creator.level] = _.extend({}, this.game.opponent.levels[this.game.creator.level]);
			this.game.creator.levels[this.game.creator.level].filled = [];
		} else {
			this.game.creator.levels[this.game.creator.level] = {
				letters: this.fillField(config.fieldSize),
				filled: [],
				goal: config.letters[_.random(0, config.letters.length-1)]
			}
		}
		return this.game.creator.levels[this.game.creator.level];
	} else {
		++this.game.opponent.level;
		if (this.game.creator.levels[this.game.opponent.level]) {
			this.game.opponent.levels[this.game.opponent.level] = _.extend({}, this.game.creator.levels[this.game.opponent.level]);
			this.game.opponent.levels[this.game.opponent.level].filled = [];
		} else {
			this.game.opponent.levels[this.game.opponent.level] = {
				letters: this.fillField(config.fieldSize),
				filled: [],
				goal: config.letters[_.random(0, config.letters.length-1)]
			}
		}
		return this.game.opponent.levels[this.game.opponent.level];
	}
}

Service.prototype.fillField = function(fieldSize) {
	var result = [],
		letters = config.letters,
		seeds = ['МАСКАРАД', 'ДЕРЕЖАБЛЬ', 'ВЕСНУШКА', 'КВАРТИРА', 'ЧЕМОДАН', 'ФАБРИКА', 'ДЕПРЕССИЯ', 'ОЛИГАРХ', 'ВОРОНОК'],
		seed = seeds[_.random(0,seeds.length-1)],
		seedLetters = seed.split(""),
		i,j;

	// первые две строчки формируем из seed
	result[0] = [];
	result[1] = [];

	seedLetters.forEach(function(letter) {
		do {
			i = _.random(0,1);
			j = _.random(0,fieldSize-1);
		} while(result[i][j] != null);
		result[i][j] = {letter: letter};
	});

	// дополняю случайными буквами
	for(i = 0; i < 2; i++) {
		for(j = 0; j < fieldSize; j++) {
			if (!result[i][j]) {
				result[i][j] = {letter: letters[_.random(0, letters.length-1)], type: ''};
			}
		}
	}

	// заполняю остальные строки
	for(i = 2; i < fieldSize; i++) {
		result[i] = [];
		for(j = 0; j < fieldSize; j++) {
			result[i][j] = {letter: letters[_.random(0, letters.length-1)], type: ''};
		}
	}

	// помечаю первую строчу как заполненную
	result[0].forEach(function(cell) {
		cell.type = 'fill';
	});

	// вторую, как доступную
	result[1].forEach(function(cell) {
		cell.type = 'avail';
	});

	return result;
}

Service.prototype.applyLetters = function(userModel, letters) {
	if (this.game.creator.uid == userModel.id) {
		if (this.game.creator.levels[this.game.creator.level]) {
			this.game.creator.levels[this.game.creator.level].filled = this.game.creator.levels[this.game.creator.level].filled.concat(letters)
		}
	} else {
		if (this.game.opponent.uid == userModel.id) {
			if (this.game.opponent.levels[this.game.opponent.level]) {
				this.game.opponent.levels[this.game.opponent.level].filled = this.game.opponent.levels[this.game.opponent.level].filled.concat(letters)
			}
		}
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