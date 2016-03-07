/**
 * API vk
 */
var socketsService = require(SERVICES_PATH + '/sockets');
var _ = require('underscore');
var fs = require('fs');
var restler = require('restler');

var API = function() {
	var me = this;

	me.channel = socketsService.createChannel('vk');
	me.channel.on('upload_wallpost_image', me.cmdUploadWallpostImage, me);

	me.errorChannel = socketsService.createChannel('error');
}

//============== API commands ==============

API.prototype.cmdUploadWallpostImage = function(userModel, data, callback) {
	var me = this,
		imagePath = BASE_PATH + '/client/img/' + data.img;

console.log('start upload');
console.log(data.image);

	fs.stat(imagePath, function(err, stats) {
	    restler.post(data.upload_url, {
	        multipart: true,
	        data: {
	            "folder_id": "0",
	            "filename": restler.file(imagePath, null, stats.size, null, "image/jpg")
	        }
	    }).on("complete", function(data) {
	    	console.log('complete');
	        callback();
	    });
	});
}

// Создает только один экземпляр класса
API.getInstance = function(){
    if (!this.instance) {
    	this.instance = new API();
    }
    return this.instance;
}

module.exports = API.getInstance();