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
		cellWidth: 55 + 7,
		cellHeight: 55+ 6,

		template: _.template(tpl),

		// @cfg
		// fieldSize
		// letters - буквы
		initialize: function(config) {
			this.config = config;
		},

		render: function() {
			this.$el.html(this.template({
				fieldSize: this.config.fieldSize,
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

			for(var i = 0; i < this.config.fieldSize.rows; i++) {
				field.push(new Array(5));
			}

			_.each(this.config.letters, function(value) {
				field[value.row][value.column] = value;
			});

			return field;
		},

		/**** Анимация источника */
		showSourceHit: function(data, callback) {
			var me = this;

			// нахожу все буквы, которых нет в данных источника (буквы удара) и подкрашиваю в зеленый
			_.each(me.config.letters, function(value) {
				if (!data.src[value.id]) {
					me.$el.find('.letter[data-id="'+ value.id +'"]').addClass('submit');
				}
			});

			// пауза и затем смещаю их вниз
			setTimeout(function() {
				// смещаю вниз
				me.$el.find('.submit').addClass('src-anim2');

				// смещаю остальные буквы на своем поле
				_.each(me.config.letters, function(value) {
					if (data.src[value.id] && data.src[value.id].row != value.row) {
						me.$el.find('.letter[data-id="'+ value.id +'"]').css('top', (data.src[value.id].row * me.cellHeight) + 'px');
					}
				});

				// показываю новые буквы
				setTimeout(function() {
					_.each(data.src, function(value) {
						if (!me.config.letters[value.id]) {
							var el = $('<div class="letter">'+ value.letter +'</div>');
							el.attr('data-id', value.id);
							el.css({
								top: (value.row * me.cellHeight ) +'px',
								left: (value.column * me.cellWidth) + 'px',
								display: 'none',
							});
							me.$el.find('.field-inner').append(el);
							el.fadeIn();
						}
					});

					me.config.letters = data.src;

				}, 200);

				// пауза и удаляю все буквы удара и вызываю коллбек
				setTimeout(function() {
					me.$el.find('.submit').remove();
				}, 1000);

				callback();

			}, 500);

		},

		/**** Анимация приёмника */
		showDestHit: function(data, callback) {
			var me = this;

			// нахожу буквы удара и располагаю их за полем, и затем смещаю в ячейки
			_.each(data.dest, function(value) {
				if (!me.config.letters[value.id]) {
					var el = $('<div class="letter dest-anim2">'+ value.letter +'</div>');
					el.attr('data-id', value.id);
					el.css({
						left: (value.column * me.cellWidth) + 'px',
					});
					me.$el.find('.field-inner').append(el);
					(function(el,value) {
						setTimeout(function() {
							el.css('top', (data.dest[value.id].row * me.cellHeight) + 'px');

							// скидываю цвет
							setTimeout(function() {
								el.removeClass('dest-anim2');
							}, 900);

						},200);
					}(el,value));
				}
			});

			me.config.letters = data.dest;

			callback();
		},

	});

	return View;
});