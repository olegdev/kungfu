/**
 * Справочник ботов
 *
    id - идентификатор
    name - имя
    img - картинка
    league - лига
    points - кол-во очков
 */
var Reference = {};
var _ = require('underscore');

/**
 * 
 */
Reference.func = function() {
	//
}

// послдение строчки обрабатываются grunt'ом, не менять!

Reference.data = JSON.parse(require('fs').readFileSync(__filename + 'on', 'utf8'));
module.exports = Reference;