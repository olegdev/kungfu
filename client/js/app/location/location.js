/**
 * Модуль локации.
 *
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'battle_search/battle_search',
	'location/views/info',
	'location/views/controls',
	'location/views/window',
	'text!location/templates/main.tpl',
	'references/messages'
], function($, _, Backbone, BattleSearch, InfoView, ControlsView, windowView, mainTpl, messages) {

	var userModel;

	var onFightClick = function() {
		BattleSearch.search(userModel);

		// setTimeout(function() {
		// 	$('#s1').css({'font-size': '150px', opacity: '0', left: '731px'});
		// 	setTimeout(function() {
		// 		$('#s2').css({'font-size': '150px', opacity: '0', left: '731px'});
		// 	}, 1000);

		// 	$('#viewport').fadeOut();
		// 	$('#window').fadeOut();
		// }, 2000);
	}

	var onRatingClick = function() {
		//
	}

	var onTournamentClick = function() {
		//
	}

	return {
		render: function(user) {

			userModel = user;

			$(document.body).html(_.template(mainTpl)({messages: messages}));

			var infoView = new InfoView({
				el: $('#infoview-box'),
				model: userModel,
			});

			var controlsView = new ControlsView({
				el: $('#controlsview-box'),
				model: userModel,
				events: {
					'click #fight-btn': onFightClick,
					'click #rating-btn': onRatingClick,
					'click #tournament-btn': onTournamentClick,
				},
			});

			infoView.render();
			controlsView.render();
		}
	};
});