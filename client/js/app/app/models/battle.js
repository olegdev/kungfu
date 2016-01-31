define([		
	'backbone',
], function(Backbone) {

	var Model = Backbone.Model.extend({

		// @attributes
		// side,
		// fieldSize,
		// battle,

		initialize: function() {
			//
		},

		getMyInfo: function() {
			if (this.attributes.side == 1) {
				return this.attributes.battle.side1;
			} else {
				return this.attributes.battle.side2;
			}
		},

		getEnemyInfo: function() {
			if (this.attributes.side == 1) {
				return this.attributes.battle.side2;
			} else {
				return this.attributes.battle.side1;
			}
		},

		getFieldSize: function() {
			return this.attributes.battle.fieldSize;
		}

	});

	return Model;
});