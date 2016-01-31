/**
 * Модуль боя.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',
	'app/models/battle',
	'battle/views/battle_container',
], function($, _, Backbone, sockets, BattleModel, BattleContainerView) {

	var channel = sockets.createChannel('battle');
	channel.on('start', function(data) {
		battle = new BattleModel(data);
		startBattle();
	});

	var battle; // Модель боя

	// Старт боя
	var startBattle = function() {
		var battleContainerView = new BattleContainerView({
			model: battle,
		});
	}

	return {
		//
	};
});

/************

1. модель боя на клиенте
2. очередь не очищается

******/