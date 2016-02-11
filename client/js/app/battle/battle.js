/**
 * Модуль боя.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets/sockets',

	'location/location',

	'battle/battle_hits',
	'battle/views/battle_container',

], function($, _, Backbone, sockets, LocationService, BattleHits, BattleContainerView) {

	var channel = sockets.createChannel('battle');

	/*** API listeners */
	channel.on('start', function(data) {
		showBattle(data);
	});
	channel.on('hit', function(data) {
		processHit(data);
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

		var battleContainerView = new BattleContainerView({
			side1: side1,
			side2: side2,
			fieldSize: data.battle.fieldSize,
		});

		battleContainerView.on('submit', function(word) {
			channel.push('word', {word});
		});

		BattleHits.init(battleContainerView, function() {
			loadFinishAndShow();
		});

	}

	/*** Пришел удар */
	var processHit = function(data) {
		BattleHits.processHit(data.hit);
	}

	/*** Показываю последний удар и окно результата */
	var showFinish = function(data) {
		var me = this;

		BattleHits.processHit(data.hit, function() {
			BattleHits.stopMonitor();
			LocationService.render();
		});
	}

	return {
		loadAndShow: function() {
			channel.push('get_battle', {}, function(data) {
				showBattle(data);
			});
		}
	};
});