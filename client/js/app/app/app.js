define([		
	'logger/logger',
	'sockets/sockets',
	'app/models/user',
	'battle/battle',
	'location/location',
	'dictionary/dictionary',
	'sound/sound',
], function(Logger, sockets, UserModel, battle, location, dictionary, sound) {

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
				alert(data.msg);
			});

			return APP;
		},
	};
});
