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

var userService = require(SERVICES_PATH + '/user/user');

var Service = function() {
	//
}

Service.prototype.auth = function(request, callback) {
	var me = this,
		user;

	if (me.checkSig(request)) {
		if (request.is_app_user) {
			mongoose.model('users').findOne({'auth.vkId': request.viewer_id}, function(err, user) {
				if (err) {
					callback(error.factory('vk', 'auth', 'DB error ' + err, logger));
				} else {
					if (user) {
						callback(null, user.get('_id'));
					} else {
						callback(null, false);
					}
				}
			});
		} else {
			userService.register({auth: {vkId: request.viewer_id, info: {title: 'u', img: ''}}}, function(err, userModel) {
				if (!err) {
					callback(error.factory('vk', 'auth', 'User register error ' + err, logger));
				} else {
					callback(null, userModel.model.id);
				}
			});
		}
	} else {
		callback(error.factory('vk', 'auth', 'Request signature is not valid', logger));
	}
}

Service.prototype.checkSig = function(request) {
	var str = request.api_id + '_' + request.viewer_id + '_' + config.app_secret;
	return request.auth_key === crypto.createHash('md5').update(str).digest('hex');
}

// Создает только один экземпляр класса
Service.getInstance = function() {
    if (!this.instance) {
    	this.instance = new Service();
    }
    return this.instance;
}

module.exports = Service.getInstance();