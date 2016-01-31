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
	this.words = [];
}

// перезагрузка словаря (используется поставщиком данных, например, грантом)
Service.prototype.setData = function(data, callback) {
	var me = this;

	data = _.map(data, function(v) {
		return {value: v};
	});

	mongoose.model('words').find().remove(function(err) {
		if (!err) {
			mongoose.model('words').collection.insert(data, function(err) {
				if (!err) {
					callback();
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

	me.words = [];

	mongoose.model('words').find().lean().exec(function(err, words) {
		if (!err) {
			me.words = _.map(words, function(w) {
				return w.value;
			});
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
		return me.words.indexOf(word.toLowerCase()) != -1;
	}
}

// выдает случайное слово соответствующей длины
Service.prototype.getWordByLength = function(wordLength) {
	var me = this,
		word;
	while(!word) {
		var randomIndex = _.random(0, me.words.length);
		for(var i = randomIndex; i < me.words.length; i++) {
			if (me.words[i].length == wordLength) {
				word = me.words[i];
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