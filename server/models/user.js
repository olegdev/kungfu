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
	stats: {
		rating: Number,
		wins: Number,
		loses: Number,
	},
	timed: {
		energy: Array
	},
});
var model = mongoose.model('users', schema);

module.exports = model;