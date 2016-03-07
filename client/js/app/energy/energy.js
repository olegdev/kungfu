/**
 * Модуль энергетический.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	
	'sockets/sockets',
	'session/session',
	'social/social',

	'references/messages',

	'energy/views/energy_window',

], function($, _, Backbone, sockets, session, social, messages, EnergyWindowView) {

	var channel = sockets.createChannel('energy'),
		win;

	/** API listeners */
	channel.on('low_energy', function(data) {
		onCmdLowEnergy(data);
	});

	/*** Показать окно восстановления энергии */
	var showWindow = function(config) {
		win = new EnergyWindowView(config || {});
		win.on('free-energy', function() {
			freeEnergy(function() {
				win.close();
			})
		});
		win.on('money-energy', function() {
			moneyEnergy(function() {
				win.close();
			})
		});
	}

	// энергия закончилась. показываю уведомление и окно восстановления
	var onCmdLowEnergy = function(data) {
		if (win) {
			//
		}
	}

	var freeEnergy = function(callback) {
		social.wallPost('vk_messages_image.jpg', "tada", function() {
			console.log('callback in energy');
			callback();
		})
	}

	var moneyEnergy = function(callback) {
		callback();
	}

	return {
		showWindow: function() {
			showWindow({hint: true});
		}
	};
});