/**
 * API зарницы
 */
var socketsService = require(SERVICES_PATH + '/sockets');
var zarnicaService = require(SERVICES_PATH + '/zarnica/zarnica');
var dictionaryService = require(SERVICES_PATH + '/dictionary/dictionary');

var API = function() {
	var me = this;

	me.channel = socketsService.createChannel('zarnica');
	me.channel.on('new_game', me.cmdNewGame, me);
	me.channel.on('check', me.cmdCheck, me);
}

//============== API commands ==============

API.prototype.cmdNewGame = function(userModel, params, callback) {
	var me = this,
		game;

	if (zarnicaService.hasGame()) {
		game = zarnicaService.getGame();
		if (!game.opponent) {
			game.opponent = {
				uid: userModel.id,
				login: userModel.model.asJson('auth.login'),
				letters: [],
				level: 1,
				levels: {},
			}
		}

		me.channel.push(game.creator.uid, 'start', {game: game});

	} else {
		game = zarnicaService.createGame(userModel);
	}

	callback({game: game});
}

API.prototype.cmdCheck = function(userModel, params, callback) {
	var me = this,
		word = '',
		game = zarnicaService.getGame();

	params.letters.forEach(function(item) {
		word += item.letter.letter;
	});

	if (dictionaryService.hasWord(word)) {
		console.log(game.creator.level, game.opponent.level);
		if (game.creator.level == game.opponent.level) {
			me.channel.push(userModel.id == game.opponent.uid ? game.creator.uid : game.opponent.uid, 'hit', params.letters);
		}

		zarnicaService.applyLetters(userModel, params.letters);
		callback('jugga!');

		var hasGoal = false;
		params.letters.forEach(function(letter) {
			if (letter.i == -1 && letter.j == -1) {
				hasGoal = true;
			}
		});

		if (hasGoal) {
			if (userModel.id == game.creator.uid) {
				if (game.creator.level == 3) {
					me.channel.push(game.creator.uid, 'win');
					me.channel.push(game.opponent.uid, 'loss');
					zarnicaService.game = null;
				} else {
					zarnicaService.createLevel(game.creator.uid);
					me.channel.push(game.creator.uid, 'level', {
						level: game.creator.levels[game.creator.level],
						opp: game.opponent.levels[game.opponent.level]
					});
				}
			} else {
				if (game.opponent.level == 3) {
					me.channel.push(game.opponent.uid, 'win');
					me.channel.push(game.creator.uid, 'loss');
					zarnicaService.game = null;
				} else {
					zarnicaService.createLevel(game.opponent.uid);
					me.channel.push(game.opponent.uid, 'level', {
						level: game.opponent.levels[game.opponent.level],
						opp: game.creator.levels[game.creator.level]
					});
				}
			}
		}
		
	} else {
		callback(false);
	}
}

// Создает только один экземпляр класса
API.getInstance = function(){
    if (!this.instance) {
    	this.instance = new API();
    }
    return this.instance;
}

module.exports = API.getInstance();