/**
 * Модуль звуков.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',

	'references/sounds',

], function($, _, Backbone, sockets, sounds) {

	var soundEls = {};

	$(function() {
		sounds.data.forEach(function(sound) {
			soundEls[sound.key] = $('<audio src="'+ sound.value +'"></audio>')[0];
			$(document.body).append(soundEls[sound.key]);
		});
	});

	return {
		play: function(soundKey) {
			if (soundEls[soundKey]) {
				soundEls[soundKey].play();
			}
		}
	};
});