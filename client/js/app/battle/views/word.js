/*** Контейнер слова */
define([
	'jquery',
	'underscore',
	'backbone',

	'dictionary/dictionary',

	'text!battle/templates/word.tpl',
	'references/messages',
], function($, _, Backbone, dictionary, tpl, messages) {

	var View = Backbone.View.extend({

		id: 'word-container',
		template: _.template(tpl),

		word: [],
		valid: false,

		events: {
			'click' : 'onClick',
		},

		// @cfg
		// field - данные поля
		initialize: function(config) {
			this.config = config;
			this.render();
		},

		render: function() {
			this.$el.html(this.template({
				word: this.word,
				messages: messages,
			}));
		},

		addLetter: function(index) {
			var cellIndex = index.split(' ');
			this.word.push(this.config.field[cellIndex[0]][cellIndex[1]]);
			this.onChange();
		},

		removeLetter: function(index) {
			for(var i = 0; i < this.word.length; i++) {
				if (this.word[i].index == index) {
					break;
				}
			}
			if (i < this.word.length) {
				this.word = this.word.slice(0, i);
			}
			this.onChange();
		},

		onChange: function() {
			var me = this,
				word = '', valid;
			if (this.word.length >= 3) {
				this.word.forEach(function(item) {
					word += item.letter;
				});
				valid = dictionary.checkWord(word);
			} else {
				valid = false;
			}

			if (valid != this.valid) {
				this.valid = valid;
				if (this.valid) {
					this.$el.addClass('valid');
				} else {
					this.$el.removeClass('valid');
				}
			}

			if (this.word.length > 8) {
				this.$el.addClass("more-letters");
			} else {
				this.$el.removeClass("more-letters");
			}

			this.render();
		},

		onClick: function() {
			if (this.$el.hasClass('valid')) {
				this.trigger('submit', this.word);
				this.word = [];
				this.onChange();
			}
		}

	});

	return View;
});