/*** Контейнер слова */
define([
	'jquery',
	'underscore',
	'backbone',

	'dictionary/dictionary',
	'sound/sound',

	'text!battle/templates/word.tpl',
	'references/messages',
], function($, _, Backbone, dictionary, sound, tpl, messages) {

	var View = Backbone.View.extend({

		id: 'word-container',
		template: _.template(tpl),

		word: [],
		valid: false,

		events: {
			'click li' : 'onWordClick',
			'click .clear-word-btn' : 'onClearClick',
		},

		// @cfg
		// letters - хеш букв игрока
		initialize: function(config) {
			this.letters = config.letters;
			
			this.word = [];
			this.valid = false;

			this.render();
		},

		render: function() {
			this.$el.html(this.template({
				word: this.word,
				messages: messages,
				waitRound: this.waitingRound,
			}));
		},

		addLetter: function(id) {
			this.word.push(this.letters[id]);
			this.onChange();
			// sound.play('click');
		},

		removeLetter: function(id) {
			for(var i = 0; i < this.word.length; i++) {
				if (this.word[i].id == id) {
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
			this.word.forEach(function(item) {
				word += item.letter;
			});
			valid = dictionary.checkWord(word);

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

		onWordClick: function() {
			if (this.$el.hasClass('valid')) {
				this.trigger('submit', this.word);
				this.word = [];
				this.waitingRound = true;
				this.onChange();
			}
		},

		onClearClick: function() {
			this.trigger('clear');
			this.word = [];
			this.onChange();			
		},

		onRound: function(letters) {
			this.letters = letters;
			this.waitingRound = false;
			this.render();
		},

	});

	return View;
});