/**
 * Модуль VK.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	
	'sockets/sockets',
	'session/session',

	'references/messages',

], function($, _, Backbone, sockets, session, messages) {

	var vkChannel = sockets.createChannel('vk');

	return {

		init: function() {
			require(["//vk.com/js/api/xd_connection.js?2"], function() {
				VK.init(function() {
					//
				});
			});
		},

		wallPost: function(image, message, callback) {
			var me = this;
			VK.api('photos.getWallUploadServer', function(result) {
				vkChannel.push('upload_wallpost_image', {upload_url: result.response.upload_url, image: image}, function(resp) {
					VK.api('photos.saveWallPhoto', resp, function(result) {
						var photo = result.response[0].id;
						var params = {
							message: message, // + ' http://vk.com/app' + config.user.payment_app + '_' + user.get('social').social_net_id + '#msg_id' + getUID(),
							attachments: photo
						};
						VK.api('wall.post',params,function(result) {
							if (result.response && result.response.post_id) {
								if (callback) {
									callback();
								}
							}
						});
					});
				});
			});
		}
	};
});