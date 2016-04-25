/*** Нижнее поле с буквами */
define([
	'jquery',
	'underscore',
	'backbone',

	'battle/views/battle_side2',
	'battle/views/word',
	'text!battle/templates/side1.tpl',
	'references/messages',
], function($, _, Backbone, BattleSide2View, WordView, tpl, messages) {

	var View = BattleSide2View.extend({

		className: 'field field-my',
		template: _.template(tpl),

		events: {
			'click .letter': 'onLetterClick',
		},

		render: function() {
			var me = this;

			BattleSide2View.prototype.render.apply(this, arguments);

			this.wordView = new WordView({
				letters: this.letters,
			});
			this.wordView.on('submit', _.bind(this.onWordSubmit, this));
			this.wordView.on('clear', _.bind(this.onWordClear, this));

			setTimeout(function() {
				me.$el.parent().append(me.wordView.$el);
			}, 0);

			return this;
		},

		onLetterClick: function(e) {
			var me = this,
				$el = $(e.currentTarget);

			if ($el.hasClass('submit') || this.$el.hasClass('blocked')) {
				return;
			}

			if ($el.hasClass('selected')) {
				this.wordView.removeLetter($el.attr('data-id'));
			} else {
				this.wordView.addLetter($el.attr('data-id'));
			}

			this.$el.find('.letter').removeClass('selected');
			this.wordView.word.forEach(function(item) {
				me.$el.find('.letter[data-id="'+ item.id +'"]').addClass('selected');
			});
		},

		onWordSubmit: function(word) {
			this.$el.find('.selected').removeClass('selected').addClass('submit');
			this.trigger('submit', word);

			this.$el.addClass('blocked');
		},

		onWordClear: function(word) {
			this.$el.find('.selected').removeClass('selected');
		},

		onRound: function(letters) {
			BattleSide2View.prototype.onRound.apply(this, arguments);
			this.$el.removeClass('blocked');
			this.wordView.onRound(this.letters);
		},

		placeLetter: function(letter, isNew) {
			var me = this;
			if (isNew) {
				el = $('<div class="letter">'+ letter.letter +'</div>');
				el.attr('data-id', letter.id);
				el.css({
					top: ((me.fieldSize.rows-1-letter.row) * me.cellHeight) +'px',
					left: (letter.column * me.cellWidth) + 'px',
					display: 'none',
				});
				me.$el.find('.field-inner').append(el);
				el.fadeIn();
			} else {
				el = me.$el.find('.letter[data-id="'+ letter.id +'"]');
				el.css('top', ((me.fieldSize.rows-1-letter.row) * me.cellHeight) + 'px');
			}
		},

	});

	return View;
});