/**
 * Модуль словаря
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',
], function($, _, Backbone, sockets) {

	var channel = sockets.createChannel('dictionary'),
		dictionary = {};

	// Загружаю из локального хранилища
	if (localStorage.getItem('dictionary')) {
		dictionary = JSON.parse(localStorage.getItem('dictionary'));
	}

	return {
		checkUpdate: function(callback) {
			if (dictionary.version) {
				channel.push('get_version', {}, function(data) {
					callback(dictionary.version == data.version);
				});
			} else {
				callback(false);
			}
		},
		load: function(callback) {
			channel.push('load', {}, function(data) {
				dictionary = data.dictionary;
				callback();
				// сохраняю в локальном хранилище
				localStorage.setItem('dictionary', JSON.stringify(dictionary));
			});
		},
		checkWord: function(word) {
			return dictionary.words.indexOf(word) != -1;
		}
	};
});