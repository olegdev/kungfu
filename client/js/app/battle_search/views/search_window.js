/*** Окно поиска противника */
define([
	'jquery',
	'underscore',
	'backbone',
	'location/views/window',
	'location/views/opponents',
	'location/views/user_avatar',
	'text!battle_search/templates/search_window.tpl',
	'references/messages',
	'references/hints',
], function($, _, Backbone, windowView, opponentsView, avatarView, tpl, messages, hints) {

	var View = windowView.extend({

		/** @cfg */
		title: messages.getByKey('window_title_search'),

		initialize: function(config) {
			config.content = _.template(tpl)({user: config.user.attributes, messages: messages, opponentsView: opponentsView, hints: hints});
			windowView.prototype.initialize.apply(this, arguments);
		},

		updateEnemy: function(data) {
			$(this.$el.find('.opponents .enemy-avatar')[0]).remove();
			$(this.$el.find('.opponents')[0]).append(avatarView.print(data, 'rtl enemy-avatar'));
		}

	});

	return View;
});