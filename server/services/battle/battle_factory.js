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

var initLetters = function() {
	var seed = dictionary.getWordByLength(config.fieldSize*2).split(""),
		index1, index2, tmp;
	// mix seed
	for(var i = 0; i < 50; i++) {
		index1 = _.random(0, seed.length-1);
		index2 = _.random(0, seed.length-1);
		tmp = seed[index2];
		seed[index2] = seed[index1];
		seed[index1] = tmp;
	}
	return seed;
}

Service.prototype.factory = function(userModel, userModel2) {
	var me = this,
		letters = initLetters(),
		battle = {
			id: userModel.id + '_' + userModel2.id,
			fieldSize: config.fieldSize,
			side1: {
				u: userModel,
				letters: letters,
			},
			side2: {
				u: userModel2,
				letters: letters,
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