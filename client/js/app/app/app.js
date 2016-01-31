define([		
	'logger/logger',
	'sockets/sockets',
	'app/models/user',
	'location/location',
	'battle/battle',
], function(Logger, sockets, UserModel, location, battle) {

	var logger = new Logger("app");

	return {
		initialize: function(config) {
			APP = {
				config: config,
				user: new UserModel(config.user),
			};

			if (APP.config.enableInfoLog) {
				Logger.enableInfoLog();
			}

			sockets.connect();

			var onlineListChannel = sockets.createChannel('onlinelist');
			onlineListChannel.on('ready', function(data) {
				location.render(APP.user);
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
