/*** Окно перед боем */
define([
	'jquery',
	'underscore',
	'backbone',
	'location/views/opponents',
	'text!battle/templates/battle_container.tpl',
	'references/messages',
], function($, _, Backbone, opponentsView, tpl, messages) {

	var View = Backbone.View.extend({

		// @cfg
		model: {}, // модель боя

		initialize: function(config) {
			this.render();
		},

		render: function() {
			$(document.body).html(_.template(tpl)({
				fieldSize: this.model.getFieldSize(),
				user: this.model.getMyInfo(),
				enemy: this.model.getEnemyInfo(),
				opponentsView: opponentsView,
				messages: messages
			}));
		}

	});

	return View;
});