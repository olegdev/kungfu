/*** Окно перед боем */
define([
	'jquery',
	'underscore',
	'backbone',
	'sound/sound',
	'battle/views/battle_side1',
	'battle/views/battle_side2',
	'location/views/opponents',
	'text!battle/templates/battle_container.tpl',
	'references/messages',
], function($, _, Backbone, sound, BattleSide1View, BattleSide2View, OpponentsView, tpl, messages) {

	var View = Backbone.View.extend({

		isBusy: false, // признак занятости (выставляется перед анимацией удара)

		// @cfg
		// side1
		// side2
		// fieldSize
		initialize: function(config) {
			this.config = config;
			this.render();
		},

		render: function() {
			var me = this;

			$(document.body).html(_.template(tpl)({
				opponents: OpponentsView.print(this.config.side1.u, this.config.side2.u),
			}));

			this.myFieldView = new BattleSide1View({
				fieldSize: this.config.fieldSize,
				letters: this.config.side1.letters,
			});

			this.enemyFieldView = new BattleSide2View({
				fieldSize: this.config.fieldSize,
				letters: this.config.side2.letters,
			});
			this.myFieldView.on('submit', function(word) {
				me.trigger('submit', word);
			});

			$('#battle-side1').append(this.myFieldView.render().$el);
			$('#battle-side2').append(this.enemyFieldView.render().$el);

			// sound.play('song1');

		},

		showRound: function(data) {
			var me = this,
				mySide, enemySide;

			if (data.battle.sides[0].u.id == APP.user.attributes.id) {
				this.myFieldView.setLetters(data.battle.sides[0].letters);
				this.enemyFieldView.setLetters(data.battle.sides[1].letters);
			} else {
				this.myFieldView.setLetters(data.battle.sides[1].letters);
				this.enemyFieldView.setLetters(data.battle.sides[0].letters);
			}
		},

		showFinish: function(data, callback) {
			var me = this;
			if (data.battle.sides[0].u.id == APP.user.attributes.id) {
				this.myFieldView.animFinish(callback);
			} else {
				this.enemyFieldView.animFinish(callback);
			}
		},

		// /**
		//  * Показ удара
		//  * @deprecated
		//  */
		// showHit: function(data) {
		// 	var me = this,
		// 		field1, field2;

		// 	me.isBusy = true;

		// 	// определяю чей лог пришел
		// 	if (me.config.side1.u.id == data.owner_id) {
		// 		field1 = me.myFieldView;
		// 		field2 = me.enemyFieldView;
		// 	} else {
		// 		field1 = me.enemyFieldView;
		// 		field2 = me.myFieldView;
		// 	}

		// 	// показываю анимацию источника
		// 	field1.showSourceHit(data, function() {

		// 		// показываю анимацию приёмника
		// 		field2.showDestHit(data, function() {
		// 			setTimeout(function() {

		// 				if (data.finished) {
		// 					sound.play('hit_finished');
		// 					field2.animFinish(function() {
		// 						me.isBusy = false;	
		// 					});
		// 				} else if (data.quality == 1) {
		// 					// звук удара 
		// 					sound.play('hit_1');
		// 					me.isBusy = false;
		// 				} else if (data.quality == 2) {
		// 					sound.play('hit_' + data.quality);
		// 					field2.startBlurLetters();
		// 					setTimeout(function() {
		// 						field2.stopBlurLetters(function() {
		// 							//
		// 						});
		// 						me.isBusy = false;
		// 					}, 1000);
		// 				} else {
		// 					sound.play('hit_1');
		// 					// звук качественного удара
		// 					setTimeout(function() {
		// 						sound.play('hit_' + data.quality);
		// 					}, 200);

		// 					field2.startBlurLetters();
		// 					field2.smashLetters();
							
		// 					setTimeout(function() {
		// 						field2.stopBlurLetters(function() {
		// 							//
		// 						});
		// 						field2.unsmashLetters();
		// 						me.isBusy = false;
		// 					}, 1500);
		// 				}
		// 			}, 200);
		// 		});
		// 	});
		// },

	});

	return View;
});