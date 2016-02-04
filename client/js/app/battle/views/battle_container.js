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

		model: {}, // модель боя

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
				field: this.config.side1.field,
			});

			this.side2Field = new BattleSide2View({
				fieldSize: this.config.fieldSize,
				field: this.config.side2.field,
			});
			this.side1Field.on('submit', function(word) {
				me.trigger('submit', word);
			});

			$('#battle-side1').append(this.side1Field.render().$el);
			$('#battle-side2').append(this.side2Field.render().$el);

		},

	});

	return View;
});