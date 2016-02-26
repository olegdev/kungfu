/*** Инфо о юзере */
define([
	'jquery',
	'underscore',
	'backbone',

	'session/session',

	'text!location/templates/views/info.tpl',
	'location/views/user_avatar',
	'references/messages',
	'references/leagues'
], function($, _, Backbone, session, tpl, userAvatarView, messages, leagues) {

	var View = Backbone.View.extend({

		template: _.template(tpl),

		render: function() {
			this.$el.html(this.template({data: APP.user.attributes, session: session, messages: messages, leagues: leagues, userAvatarView: userAvatarView}));
			return this;
		}
	});

	return View;
});