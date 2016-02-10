/*** Окно перед боем */
define([
	'jquery',
	'underscore',
	'backbone',
	'battle/views/battle_side1',
	'battle/views/battle_side2',
	'location/views/opponents',
	'text!battle/templates/battle_container.tpl',
	'references/messages',
], function($, _, Backbone, BattleSide1View, BattleSide2View, OpponentsView, tpl, messages) {

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

			this.side1Field = new BattleSide1View({
				fieldSize: this.config.fieldSize,
				letters: this.config.side1.letters,
			});

			this.side2Field = new BattleSide2View({
				fieldSize: this.config.fieldSize,
				letters: this.config.side2.letters,
			});
			this.side1Field.on('submit', function(word) {
				me.trigger('submit', word);
			});

			$('#battle-side1').append(this.side1Field.render().$el);
			$('#battle-side2').append(this.side2Field.render().$el);

		},

		/**
		 * Показ удара
		 */
		showHit: function(data) {
			var me = this,
				field1, field2;

			me.isBusy = true;

			// определяю чей лог пришел
			if (me.config.side1.u.id == data.owner_id) {
				field1 = me.side1Field;
				field2 = me.side2Field;
			} else {
				field1 = me.side2Field;
				field2 = me.side1Field;
			}

			// показываю анимацию источника
			field1.showSourceHit(data, function() {
				// показываю анимацию приёмника
				field2.showDestHit(data, function() {
					me.isBusy = false;
				});
			});
		},

	});

	return View;
});