/**
 * Загрузка словаря
 */

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var dictionary = require(SERVICES_PATH + '/dictionary/dictionary');
var dbconnect = require(SERVICES_PATH + '/dbconnect/dbconnect');

require(BASE_PATH + '/server/models/word'); 

module.exports = function(grunt) {
	return function() {
	    var options = this.options();
		var data = fs.readFileSync(options.dataFileName, 'utf8');
		var done = this.async();
		dictionary.setData(data.split('\r\n'), function(err) {
			if (err) {
				grunt.log.error('Error:', err);
				done(false);
			} else {
				done(true);
			}
		});
	}
};