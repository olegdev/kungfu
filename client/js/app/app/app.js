define([		
	'logger/logger',
	'sockets/sockets',
	'app/models/user',
	'battle/battle',
	'location/location',
	'dictionary/dictionary',
	'social/vk',
	'sound/sound',
], function(Logger, sockets, UserModel, battle, location, dictionary, vk, sound) {

	var logger = new Logger("app");

	return {
		initialize: function(config) {
			APP = {
				config: config,
				user: new UserModel(config.user),
			};

			if (APP.config.debug) {
				Logger.enableInfoLog();
			}

			sockets.connect();

			if (APP.user.get('auth').vk) {
				vk.init();
			}

			var onlineListChannel = sockets.createChannel('onlinelist');
			onlineListChannel.on('ready', function(data) {
				if (APP.user.get('bindings').battle) {
					dictionary.checkUpdate(function() {
						battle.loadAndShow();
					});
				} else {
					location.render(APP.user);
				}
				onlineListChannel.push('get_online', {}, function(data) {
					logger.info('online list', data);
				});
			}, {single: true});

			var errorChannel = sockets.createChannel('error');
			errorChannel.on('error', function(data) {
				if (APP.config.debug) {
					alert(data.msg);
				} else {
					if (console && console.error) {
						console.error(data.msg);
					}
				}
			});

			return APP;
		},
	};
});
