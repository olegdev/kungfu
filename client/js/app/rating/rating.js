/**
 * Модуль рейтинга.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	
	'sockets/sockets',
	'session/session',
	'social/social',

	'references/messages',

	'rating/views/rating_window',

], function($, _, Backbone, sockets, session, social, messages, RatingWindowView) {

	var channel = sockets.createChannel('rating'),
		win;

	/** API listeners */
	/** ***** **/

	/*** Показать окно рейтинга */
	var showWindow = function(config) {

		config = config || {};
		channel.push('get_rating', {}, function(data) {
			data.sort(function(v1,v2) {
				if (v1.rating.league != v2.rating.league) {
					return v2.rating.league - v1.rating.league;
				} else {
					return v2.place - v1.place;
				}
			});

			config.data = data;
			win = new RatingWindowView(config);
		});
	}

	return {
		showWindow: function(config) {
			showWindow(config);
		}
	};
});