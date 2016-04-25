/*** Верхнее поле с буквами */
define([
	'jquery',
	'underscore',
	'backbone',
	'text!battle/templates/side2.tpl',
	'references/messages',
], function($, _, Backbone, tpl, messages) {

	var View = Backbone.View.extend({

		className: 'field field-enemy',
		cellWidth: 41 + 5,
		cellHeight: 41 + 5,

		template: _.template(tpl),

		// @cfg
		// fieldSize
		// letters - буквы
		initialize: function(config) {
			this.letters = config.letters;
			this.fieldSize = config.fieldSize;
		},

		render: function() {
			this.$el.html(this.template({
				fieldSize: this.fieldSize,
				field: this.getField(),
				cellWidth: this.cellWidth,
				cellHeight: this.cellHeight,
				messages: messages
			}));
			return this;
		},

		getField: function() {
			var me = this,
				field = [];

			for(var i = 0; i < this.fieldSize.rows; i++) {
				field.push(new Array(5));
			}

			_.each(this.letters, function(value) {
				field[value.row][value.column] = value;
			});

			return field;
		},

		onRound: function(letters) {
			var me = this,
				oldLetters = _.extend({}, me.letters);

			me.letters = letters;

			// помечаю отсутствующие буквы как буквы удара
			_.each(oldLetters, function(value) {
				if (!letters[value.id]) {
					me.$el.find('.letter[data-id="'+ value.id +'"]').addClass('submit');
				}
			});

			// пауза и смещаю буквы удара
			setTimeout(function() {
				me.$el.find('.submit').addClass('letter-anim1');

				// смещаю остальные буквы на своем поле
				_.each(oldLetters, function(value) {
					if (letters[value.id] && letters[value.id].row != value.row) {
						me.placeLetter(letters[value.id]);
					}
				});

				// показываю новые буквы в обязательных строчках
				setTimeout(function() {
					_.each(letters, function(value) {
						if (!oldLetters[value.id] && value.row < 2) {
							me.placeLetter(value, true);
							oldLetters[value.id] = value;
						}
					});

					// показываю новые буквы в поле
					_.each(letters, function(value) {
						if (!oldLetters[value.id]) {
							var el = $('<div class="letter letter-anim2">'+ value.letter +'</div>');
							el.attr('data-id', value.id);
							el.css({
								left: (value.column * me.cellWidth) + 'px',
							});
							me.$el.find('.field-inner').append(el);
							(function(el,value) {
								setTimeout(function() {
									me.placeLetter(value);
									// скидываю цвет
									setTimeout(function() {
										el.removeClass('letter-anim2');
									}, 900);

								},100);
							}(el,value));
						}
					});

				}, 300);

				// пауза и удаляю все буквы удара и вызываю коллбек
				setTimeout(function() {
					me.$el.find('.letter-anim1').remove();
				}, 2000);

			}, 500);

		},

		placeLetter: function(letter, isNew) {
			var me = this;
			if (isNew) {
				el = $('<div class="letter">'+ letter.letter +'</div>');
				el.attr('data-id', letter.id);
				el.css({
					top: (letter.row * me.cellHeight ) +'px',
					left: (letter.column * me.cellWidth) + 'px',
					display: 'none',
				});
				me.$el.find('.field-inner').append(el);
				el.fadeIn();
			} else {
				el = me.$el.find('.letter[data-id="'+ letter.id +'"]');
				el.css('top', (letter.row * me.cellHeight) + 'px');
			}
		},

		animFinish: function(callback) {
			var me = this;

			var els = me.$el.find('.letter');

			els.addClass('finished');
			els.each(function() {
				var el = $(this),
					left;
				if (!el.hasClass('letter-anim2')) {
					left = parseInt(el.css('left')) + _.random(-100, 100);
				}
				el.css({
					top:  _.random(350, 500) +'px',
					left: left,
					transform: 'rotate('+ _.random(-30,30) +'deg)',
				});
			});

			setTimeout(function() {
				callback();
			}, 1000);
			
		},

	});

	return View;
});