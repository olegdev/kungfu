/**
 * Модель пользователя
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	auth: {
		login: String,
		pass: String,
	},
	info: {
		title: String,
		img: String,
	},
	counters: {
		wins: Number,
		loses: Number,
	},
	timed: {
		energy: Array
	},
	rating: {
		league: Number,
		points: Number
	},
	botId: Number,
});
var model = mongoose.model('users', schema);

module.exports = model;