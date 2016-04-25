/**
 * Модуль боя.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',

	'session/session',
	'location/location',

	'battle/views/battle_container',
	'battle/views/battle_result_window',

], function($, _, Backbone, sockets, session, LocationService, BattleContainerView, ResultWindowView) {

	var channel = sockets.createChannel('battle');
	var battleContainerView;

	/*** API listeners */
	channel.on('start', function(data) {
		showBattle(data);
	});
	channel.on('round', function(data) {
		processRound(data);
	});
	channel.on('finish', function(data) {
		showFinish(data);
	});

	/*** Старт боя */
	var showBattle = function(data) {
		var side1, side2;

		battleContainerView = new BattleContainerView({
			battle: data.battle,
		});

		battleContainerView.on('submit', function(word) {
			channel.push('hit', {word: word});
		});

	}

	/*** Новый раунд */
	var processRound = function(data) {
		if (battleContainerView) {
			battleContainerView.showRound(data);
		}
	}

	/*** Показываю последний удар и окно результата */
	var showFinish = function(data) {
		var me = this;

		battleContainerView.showRound(data);
		setTimeout(function() {
			battleContainerView.showFinish(data, function() {
				// обновляю данные игрока
				APP.user.set(data.user);

				// обновляю данные сессии
				if (data.battle.sides[0].u.id == APP.user.attributes.id && !data.battle.sides[0].isFinished) {
					session.set('win_counts', (session.get('win_counts') || 0) + 1);
					session.set('rating', (session.get('rating') || 0) + data.result.pointsWin);
				} else {
					session.set('lose_counts', (session.get('lose_counts') || 0) + 1);
					session.set('rating', (session.get('rating') || 0) - data.result.pointsLose);
				}

				// отрисовываю локацию
				LocationService.render();

				// показываю результат
				new ResultWindowView({
					data: data.result,
				});
			});
		}, 300);
	}

	return {
		loadAndShow: function() {
			channel.push('get_battle', {}, function(data) {
				showBattle(data);
			});
		}
	};
});