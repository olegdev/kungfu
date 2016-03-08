/**
 * Сервис ВКонтакте
 * @singleton
 */
var config = require(BASE_PATH + '/server/util').getModuleConfig(__filename);
var logger = require(SERVICES_PATH + '/logger/logger')(__filename);
var error = require(SERVICES_PATH + '/error');
var mongoose = require('mongoose');
var _ = require('underscore');
var crypto = require('crypto');
var VKSDK = require('vksdk');

var userService = require(SERVICES_PATH + '/user/user');

var Service = function() {
	this.vkApi = new VKSDK({
	   'appId'     : config.app_id,
	   'appSecret' : config.app_secret,
	   'language'  : 'ru'
	});
}

Service.prototype.auth = function(request, callback) {
	var me = this,
		user;

	if (me.checkSig(request)) {
		mongoose.model('users').findOne({'auth.vkId': request.viewer_id}, function(err, user) {
			if (err) {
				callback(error.factory('vk', 'auth', 'DB error ' + err, logger));
			} else {
				if (user) {
					callback(null, user.get('_id'));
				} else {
					console.log('request');
					me.vkApi.request('users.get', {user_id: request.viewer_id, fields: ['photo_50'], lang: 'ru'}, function(resp) {
						if (resp && resp.response && resp.response.length) {
							userService.register({
						   		auth: {
						   			vkId: request.viewer_id
						   		},
						   		info: {
						   			title: resp.response[0].first_name + ' ' + resp.response[0].last_name,
						   			img: resp.response[0].photo_50,
						   		}
						   	}, function(err, userModel) {
								if (!err) {
									callback(null, userModel.model.id);
								} else {
									callback(error.factory('vk', 'auth', 'User register error ' + err, logger));
								}
							});
						} else {
							callback(error.factory('vk', 'auth', 'Data from vk api is invalid ' + JSON.stringify(resp), logger));					
						}
					});
				}
			}
		});
	} else {
		callback(error.factory('vk', 'auth', 'Request signature is invalid', logger));
	}
}

Service.prototype.checkSig = function(request) {
	var str = request.api_id + '_' + request.viewer_id + '_' + config.app_secret;
	return request.auth_key === crypto.createHash('md5').update(str).digest('hex');
}

Service.prototype.getSigForRequest = function(viewerId, params) {
	var str = viewerId;
	_.each(params || {}, function(v, k) {
		str += k + '=' + v;
	});
	str += config.app_secret;
	console.log(str);
	return crypto.createHash('md5').update(str).digest('hex');
}

// Создает только один экземпляр класса
Service.getInstance = function() {
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();