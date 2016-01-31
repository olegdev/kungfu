/*** Инфо о юзере */
define([
	'jquery',
	'underscore',
	'backbone',
	'text!location/templates/views/info.tpl',
	'location/views/user_avatar',
	'references/messages'
], function($, _, Backbone, tpl, userAvatarView, messages) {

	var View = Backbone.View.extend({

		template: _.template(tpl),

		render: function() {
			this.$el.html(this.template({data: this.model.attributes, messages: messages, userAvatarView: userAvatarView}));
			return this;
		}
	});

	return View;
});