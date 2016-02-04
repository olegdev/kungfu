/*** Нижнее поле с буквами */
define([
	'jquery',
	'underscore',
	'backbone',

	'battle/views/battle_side2',
	'battle/views/word',
	'text!battle/templates/side1.tpl',
	'references/messages',
], function($, _, Backbone, BackboneSide2View, WordView, tpl, messages) {

	var View = BackboneSide2View.extend({

		template: _.template(tpl),

		events: {
			'click .letter': 'onLetterClick',
		},

		render: function() {
			var me = this;

			BackboneSide2View.prototype.render.apply(this, arguments);

			this.wordView = new WordView({
				field: this.config.field,
			});
			this.wordView.on('submit', _.bind(this.onWordSubmit, this));

			setTimeout(function() {
				me.$el.parent().append(me.wordView.$el);
			}, 0);

			return this;
		},

		onLetterClick: function(e) {
			var me = this,
				$el = $(e.currentTarget);

			if ($el.hasClass('submit')) {
				return;
			}

			if ($el.hasClass('selected')) {
				this.wordView.removeLetter($el.parent().attr('data-index'));
			} else {
				this.wordView.addLetter($el.parent().attr('data-index'));
			}

			this.$el.find('.letter').removeClass('selected');
			this.wordView.word.forEach(function(wordLetter) {
				me.$el.find('[data-index="'+ wordLetter.index +'"] .letter').addClass('selected');
			});
		},

		onWordSubmit: function(word) {
			this.$el.find('.selected').removeClass('selected').addClass('submit');
			this.trigger('submit', word);
		}

	});

	return View;
});