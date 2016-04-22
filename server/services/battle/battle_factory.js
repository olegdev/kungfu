/**
 * Фабрика по созданию боя
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');
var events = require('events');

var dictionary = require(SERVICES_PATH + '/dictionary/dictionary');

var Service = function() {
	var me = this;
}

Service.prototype.factory = function(userModel, userModel2) {
	return battle = new Battle(userModel, userModel2);
}

/*** Battle class */

var Battle = function(userModel, userModel2) {

	events.EventEmitter.call(this);
	
	this.type = 'rating';
	this.id = _.uniqueId('btl_');

	this.sides = [{
		u: userModel,
		letters: this._initLetters(),
	}, {
		u: userModel2,
		letters: this._initLetters(),
	}];

	this.fieldSize = {
		rows: config.rows,
		columns: config.columns,
	};

	this.roundIndex = 0;

	this._startRound();
}

Battle.prototype.asJson = function() {
	return {
		id: this.id,
		type: this.type,
		fieldSize: this.fieldSize,
		roundTime: config.roundTime,
		sides: [{
			u: this.sides[0].u.asJson('info;counters;'),
			letters: this.sides[0].letters,
			isFull: this.sides[0].isFull,
			isFinished: this.sides[0].isFinished,
		},{
			u: this.sides[1].u.asJson('info;counters;'),
			letters: this.sides[1].letters,
			isFull: this.sides[1].isFull,
			isFinished: this.sides[1].isFinished,
		}]
	}
}

Battle.prototype.addHit = function(userModel, hit) {
	if (this.sides[0].u.id == userModel.id) {
		this.sides[0].hit = hit;
	} else {
		this.sides[1].hit = hit;
	}
	if (this.sides[0].hit && this.sides[1].hit) {
		this._finishRound();
	}
}

Battle.prototype._startRound = function() {
	var me =  this;

	if (this.roundTimer) {
		clearTimeout(this.roundTimer);
	}

	this.roundTimer = setTimeout(function() {
		me._finishRound();
	}, config.roundTime * 1000);

}

Battle.prototype._finishRound = function() {
	var me = this,
		isFullSide1, isFullSide2;

	this.roundIndex++;

	if (this.sides[0].hit || this.sides[1].hit) {
		this._processHit(this.sides[0], this.sides[1]);
		this._processHit(this.sides[1], this.sides[0]);

		if (!this.sides[0].hit || !this.sides[1].hit || Object.keys(this.sides[0].hit.word).length != Object.keys(this.sides[1].hit.word).length) {
			this._markFullOrFinishIfNeeded(this.sides[0]);
			this._markFullOrFinishIfNeeded(this.sides[1]);
		}
	} else {
		// increase empty rounds count
	}

	if (this.sides[0].isFinished || this.sides[1].isFinished) {
		clearTimeout(this.roundTimer);
		this.emit('finish', this);
	} else {
		this.emit('round', this);
		this._startRound();
	}

	this.sides[0].hit = false;
	this.sides[1].hit = false;
}

Battle.prototype._processHit = function(side1, side2) {
	if (side1.hit) {
		this._removeWord(side1.letters, side1.hit.word);
		this._fillRequiredCells(side1.letters);
		this._compactCells(side1.letters);
	}
	if (side2.hit) {
		this._addWord(side1.letters, side2.hit.word);
	}
}

Battle.prototype._markFullOrFinishIfNeeded = function(side) {
	var freeCells = this._getFreeCells(this._organizeAsColumns(side.letters));
	if (freeCells.length == 0) {
		if (side.isFull) {
			side.isFinished = true;
		} else {
			side.isFull = true;
		}
	} else {
		side.isFull = false;
	}
}

Battle.prototype._fillRequiredCells = function(letters) {
	var columns = this._organizeAsColumns(letters),
		column, id;

	// генерирую случайную букву, если в первых двух строках свободное место
	for(var i = 0; i < this.fieldSize.columns; i++) {
		if (!columns[i][0]) {
			id = this._genLocalId('ltr');
			letters[id] = {
				id: id,
				row: 0,
				column: i,
				letter: dictionary.generateLetter(letters),
			};
		}
		if (!columns[i][1]) {
			id = this._genLocalId('ltr');
			letters[id] = {
				id: id,
				row: 1,
				column: i,
				letter: dictionary.generateLetter(letters),
			};
		}
	}
}

Battle.prototype._compactCells = function(letters) {
	var columns = this._organizeAsColumns(letters);
	for(var i = 0; i < this.fieldSize.columns; i++) {
		columns[i] = _.compact(columns[i]);
	}

	for(var i = 0; i < this.fieldSize.columns; i++) {
		column = columns[i];
		for(var j = 0; j < column.length; j++) {
			column[j].row = j;
			column[j].column = i;
		}
	}
}

Battle.prototype._organizeAsColumns = function(letters) {
	var columns = [];
	
	for(var i = 0; i < this.fieldSize.columns; i++) {
		columns.push(new Array(this.fieldSize.rows));
	}

	_.each(letters, function(item) {
		columns[item.column][item.row] = item;
	});

	return columns;
}

Battle.prototype._addWord = function(letters, word) {
	var columns = this._organizeAsColumns(letters),
		index = 0, id, letter, freeCells = [];

	freeCells = this._getFreeCells(columns);

	while(freeCells.length && index < word.length) {
		var cell = freeCells[_.random(0, freeCells.length-1)];
		id = this._genLocalId('ltr');
		letters[id] = {
			id: id,
			row: cell.row,
			column: cell.column,
			letter: word[index++].letter,
		};
		columns[cell.column][cell.row] = letters[id];
		freeCells = this._getFreeCells(columns);
	}
}

Battle.prototype._removeWord = function(letters, word) {
	word.forEach(function(item) {
		delete letters[item.id];
	});
}

Battle.prototype._getFreeCells = function(columns) {
	var cells = [], rowIndex = 2;
	while(!cells.length && rowIndex < this.fieldSize.rows) {
		for(var i = 0; i < columns.length; i++) {
			if (!columns[i][rowIndex]) {
				cells.push({row: rowIndex, column: i});
			}
		}
		rowIndex++;
	}
	return cells;
}

Battle.prototype._initLetters = function() {
	var innerInitLetters = function() {
		var seed = dictionary.getRandomWord(config.columns*2);
		return dictionary.mixWord(seed).split("");
	}

	var letters = {},
		inititalLetters = innerInitLetters(),
		id;

	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < config.columns; j++) {
			id = this._genLocalId('ltr');
			letters[id] = {
				id: id,
				row: i,
				column: j,
				letter: inititalLetters[i*config.rows + j],
			};
		}
	}

	return letters;
}

Battle.prototype._genLocalId = function(prefix) {
	var me = this;
	if (!me[prefix + '_counter']) {
		me[prefix + '_counter'] = 0;
	}
	return prefix + (me[prefix + '_counter']++);
}

Battle.prototype.__proto__ = events.EventEmitter.prototype;

// Создает только один экземпляр класса
Service.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();