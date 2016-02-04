/**
 * Фабрика по созданию боя
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var _ = require('underscore');

var dictionary = require(SERVICES_PATH + '/dictionary/dictionary');

var Service = function() {
	var me = this;
}

var initField = function() {
	var innerInitLetters = function() {
		var seed = dictionary.getRandomWord(config.columns*2);
		return dictionary.mixWord(seed).split("");
	}

	var field = [],
		letters = innerInitLetters(),
		row, cell;

	for(var i = 0; i < config.rows; i++) {
		row = [];
		for(var j = 0; j < config.columns; j++) {
			cell = {index: i+' '+j};
			if (letters[config.columns*i + j]) {
				cell.letter = letters[config.columns*i + j];
			}
			row.push(cell);
		}
		field.push(row);
	}

	return field;
}

Service.prototype.factory = function(userModel, userModel2) {
	var me = this,
		battle = {
			id: userModel.id + '_' + userModel2.id,
			sides: [{
				u: userModel,
				field: initField(),
			}, {
				u: userModel2,
				field: initField(),
			}],
			fieldSize: {
				rows: config.rows,
				columns: config.columns,
			},
			asJson: function() {
				return {
					id: this.id,
					fieldSize: this.fieldSize,
					sides: [{
						u: this.sides[0].u.asJson('info;stats;'),
						field: this.sides[0].field,
					},{
						u: this.sides[1].u.asJson('info;stats;'),
						field: this.sides[1].field,
					}]
				}
			}
		};
	return battle;
}

// Создает только один экземпляр класса
Service.getInstance = function(){
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();