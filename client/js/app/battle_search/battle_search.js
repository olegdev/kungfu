/**
 * Модуль поиска противника.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',
	'battle_search/views/search_window',
	'location/views/user_avatar',
], function($, _, Backbone, sockets, searchWindowView) {

	var channel = sockets.createChannel('battle_search');
	channel.on('enemy', function(data) {
		onEnemy(data);
	});

	// ссылка на окно поиска
	var win;

	// противник найден
	var onEnemy = function(data) {
		if (win) {
			win.updateEnemy(data);
		}
	}

	return {
		search: function(user) {
			win = new searchWindowView({
				user: user,
			});
			win.on('close', function() {
				win = undefined;
				channel.push('cancel', {});
			});
			channel.push('search', {}, null, {delay: 2000});
		}
	};
});