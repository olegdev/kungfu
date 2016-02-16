/**
 * Утилиты
 */
var q = require('q');
var fs = require("fs");

module.exports = {

	whenAll: function(deferreds) {
		var deferred = q.defer(),
			count = deferreds.length,
			resolved = 0;

		if (count) {
			for(var i = 0; i < count; i++) {
				deferreds[i].then(function() {
					if (++resolved == count) {
						deferred.resolve();
					}
				});
			}
		} else {
			deferred.resolve();
		}

		return deferred.promise;
	},

	getModuleConfig: function(filename) {
		if (typeof CONFIG != 'undefined' && fs.existsSync(filename.substr(0, filename.length-3) + '_' + CONFIG.server_name + '.config')) {
			return JSON.parse(fs.readFileSync(filename.substr(0, filename.length-3) + '_' + CONFIG.server_name + '.config'));	
		} else {
			return JSON.parse(fs.readFileSync(filename.substr(0, filename.length-3) + '.config'));	
		}
	}

};