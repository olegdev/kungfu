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

		if (data.battle.sides[0].u.id == APP.user.attributes.id) {
			side1 = data.battle.sides[0];
			side2 = data.battle.sides[1];
		} else {
			side1 = data.battle.sides[1];
			side2 = data.battle.sides[0];
		}

		battleContainerView = new BattleContainerView({
			side1: side1,
			side2: side2,
			fieldSize: data.battle.fieldSize,
			roundTime: data.battle.roundTime,
		});

		battleContainerView.on('submit', function(word) {
			channel.push('hit', {word: word});
		});

	}

	/*** Новый раунд */
	var processRound = function(data) {
		battleContainerView.showRound(data);

		var logMessage = '';
		if (data.battle.sides[0].hit) {
			_.each(data.battle.sides[0].hit.word, function(letter) {
				logMessage += letter.letter;
			});
		} else {
			logMessage += 'x';
		}
		logMessage += ' - '
		if (data.battle.sides[1].hit) {
			_.each(data.battle.sides[1].hit.word, function(letter) {
				logMessage += letter.letter;
			});
		} else {
			logMessage += 'x';
		}

		battleContainerView.battleLog.addMessage(logMessage);
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