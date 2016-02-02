/**
 * Сервис словаря
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var user = require(SERVICES_PATH + '/user/user');
var mongoose = require('mongoose');
var _ = require('underscore');

var Service = function() {
	this.dictionary = {};
}

// перезагрузка словаря (используется поставщиком данных, например, грантом)
Service.prototype.setData = function(version, data, callback) {
	var me = this,
		dictionaryModel = mongoose.model('dictionary');

	dictionaryModel.find().remove(function(err) {
		if (!err) {
			var dictionary = new dictionaryModel({
				version: version,
				words: data,
			});
			dictionary.save(function(err) {
				if (!err) {
					callback(null);
				} else {
					callback(err);
				}
			});
		} else {
			callback(err);
		}
	});
}

// загрузка словаря в оперативку
Service.prototype.load = function(callback) {
	var me = this;

	me.dictionary = {};

	mongoose.model('dictionary').findOne().lean().exec(function(err, json) {
		if (!err) {
			me.dictionary = json;
			callback();
		} else {
			callback(error.factory('dictionary', 'load', 'DB error ' + err, logger));
		}
	});
}

// проверка наличия слова в словаре
Service.prototype.hasWord = function(word) {
	var me = this;
	if (word) {
		return me.dictionary.words.indexOf(word.toLowerCase()) != -1;
	}
}

// выдает случайное слово соответствующей длины
Service.prototype.getWordByLength = function(wordLength) {
	var me = this,
		word;
	while(!word) {
		var randomIndex = _.random(0, me.dictionary.words.length);
		for(var i = randomIndex; i < me.dictionary.words.length; i++) {
			if (me.dictionary.words[i].length == wordLength) {
				word = me.dictionary.words[i];
				break;
			}
		}
	}
	return word;
}

// Создает только один экземпляр класса
Service.getInstance = function() {
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();