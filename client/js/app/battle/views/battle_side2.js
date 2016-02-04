/*** Верхнее поле с буквами */
define([
	'jquery',
	'underscore',
	'backbone',
	'text!battle/templates/side2.tpl',
	'references/messages',
], function($, _, Backbone, tpl, messages) {

	var View = Backbone.View.extend({

		className: 'field',
		template: _.template(tpl),
		// @cfg
		// fieldSize
		// field - данные поля в виде двумерного массива объектов
		initialize: function(config) {
			this.config = config;
		},

		render: function() {
			this.$el.html(this.template({
				fieldSize: this.config.fieldSize,
				field: this.config.field,
				messages: messages
			}));
			return this;
		}

	});

	return View;
});