/*** Окно перед боем */
define([
	'jquery',
	'underscore',
	'backbone',
	'sound/sound',
	'location/views/user_avatar',
	'battle/views/battle_side1',
	'battle/views/battle_side2',
	'battle/views/battle_log',
	'battle/views/battle_round',
	'text!battle/templates/battle_container.tpl',
	'references/messages',
], function($, _, Backbone, sound, avatarView, BattleMySideView, BattleEnemySideView, BattleLogView, BattleRoundView, tpl, messages) {

	var View = Backbone.View.extend({

		isBusy: false, // признак занятости (выставляется перед анимацией удара)

		// @cfg
		// battle
		initialize: function(config) {
			this.battle = config.battle;
			this.render();
		},

		render: function() {
			var me = this,
				mySide, enemySide;

			if (me.battle.sides[0].u.id == APP.user.attributes.id) {
				mySide = me.battle.sides[0];
				enemySide = me.battle.sides[1];
			} else {
				mySide = me.battle.sides[1];
				enemySide = me.battle.sides[0];
			}

			$(document.body).html(_.template(tpl)({
				avatarView: avatarView, 
				user: mySide.u,
				enemy: enemySide.u,
			}));

			this.roundView = new BattleRoundView({
				el: $('#battle-round-panel'),
				battle: me.battle,
			});

			this.myFieldView = new BattleMySideView({
				fieldSize: this.battle.fieldSize,
				letters: mySide.letters,
			});

			this.enemyFieldView = new BattleEnemySideView({
				fieldSize: this.battle.fieldSize,
				letters: enemySide.letters,
			});
			this.myFieldView.on('submit', function(word) {
				me.trigger('submit', word);
			});

			$('.battle-side:last').append(this.myFieldView.render().$el);
			$('.battle-side:first').append(this.enemyFieldView.render().$el);

		},

		showRound: function(data) {
			var me = this,
				mySide, enemySide;

			if (data.battle.sides[0].u.id == APP.user.attributes.id) {
				this.myFieldView.onRound(data.battle.sides[0].letters);
				this.enemyFieldView.onRound(data.battle.sides[1].letters);
			} else {
				this.myFieldView.onRound(data.battle.sides[1].letters);
				this.enemyFieldView.onRound(data.battle.sides[0].letters);
			}
			setTimeout(function() {
				me.roundView.update(data.battle);
			}, 1000);
		},

		showFinish: function(data, callback) {
			var me = this;

			var callbackWrapper = function() {
				me.roundView.update(data.battle);
				setTimeout(function() {
					callback();
				}, 2000);
			}

			if (data.battle.sides[0].isFinished) {
				if (data.battle.sides[0].u.id == APP.user.attributes.id) {
					this.myFieldView.animFinish(callbackWrapper);
				} else {
					this.enemyFieldView.animFinish(callbackWrapper);
				}	
			} else {
				if (data.battle.sides[1].u.id == APP.user.attributes.id) {
					this.myFieldView.animFinish(callbackWrapper);
				} else {
					this.enemyFieldView.animFinish(callbackWrapper);
				}
			}

		},

	});

	return View;
});