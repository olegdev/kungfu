define([		
	'backbone',
], function(Backbone) {

	var Model = Backbone.Model.extend({

		id: '',
		info: {},
		stats: {},
		timed: '',
		bindings: {},

		initialize: function() {
			//
		},

	});

	return Model;
});