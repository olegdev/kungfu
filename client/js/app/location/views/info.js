/*** Инфо о юзере */
define([
	'jquery',
	'underscore',
	'backbone',

	'session/session',

	'text!location/templates/views/info.tpl',
	'location/views/user_avatar',
	'references/messages'
], function($, _, Backbone, session, tpl, userAvatarView, messages) {

	var View = Backbone.View.extend({

		template: _.template(tpl),

		render: function() {
			this.$el.html(this.template({data: APP.user.attributes, session: session, messages: messages, userAvatarView: userAvatarView}));
			return this;
		}
	});

	return View;
});