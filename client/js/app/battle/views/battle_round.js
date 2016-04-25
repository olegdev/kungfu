/*** Отображение данных раунда */
define([
	'jquery',
	'underscore',
	'backbone',
	'text!battle/templates/battle_round.tpl',
	'references/messages',
	'date/date',
], function($, _, Backbone, tpl, messages, date) {

	var View = Backbone.View.extend({

		template: _.template(tpl),

		initialize: function(config) {
			this.battle = config.battle;
			this.render();
		},

		/**
		 * @cfg
		 * battle - Данные боя
		 */
		render: function() {
			var me = this;

			me.$el.html(me.template(me.prepareData()));

			me.roundTimer = setInterval(function() {
				var el = $('#round-timer');
				if (el.length) {
					el.html(Math.max(me.battle.round.duration - Math.round( (Date.now() - date.normalizeServerTime(me.battle.round.started)) / 1000), 1));
				} else {
					clearInterval(me.roundTimer);
				}
			}, 1000);

			return me;
		},

		update: function(data) {
			var me = this;
			me.battle = data;
			me.$el.html(me.template(me.prepareData()));
		},

		prepareData: function() {
			var me = this,
				myWord = enemyWord = '',
				mySide, enemySide;

			if (me.battle.sides[0].u.id == APP.user.attributes.id) {
				mySide = me.battle.sides[0];
				enemySide = me.battle.sides[1];
			} else {
				mySide = me.battle.sides[1];
				enemySide = me.battle.sides[0];
			}

			if (mySide.hit) {
				_.each(mySide.hit.word, function(letter) {
					myWord += letter.letter;
				});
			}
			if (enemySide.hit) {
				_.each(enemySide.hit.word, function(letter) {
					enemyWord += letter.letter;
				});
			}

			return {
				myWord: myWord,
				enemyWord: enemyWord,
				round: {
					index: me.battle.round.index,
					duration: me.battle.round.duration,
					time: Date.now() - date.normalizeServerTime(me.battle.round.started)
				}
			}

		},
	});

	return View;
});