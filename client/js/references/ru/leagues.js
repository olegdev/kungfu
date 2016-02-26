define(function() {
var module = {exports: {}};
/**
 * Справочник лиг
 *
    id - идентификатор
    index - индекс
    name - название
    points - кол-во очков для вхождения в лигу
 */
var Reference = {};
var _ = require('underscore');

/**
 * Название лиги по индексу
 */
Reference.getNameByIndex = function(index) {
	for(var i = 0; i < this.data.length; i++) {
		if (this.data[i].index == index) {
			return this.data[i].name;
		}
	}
}

// послдение строчки обрабатываются grunt'ом, не менять!

Reference.data = [{"id":1,"index":1,"name":"Белый пояс","delta":1000,"fight_count":5,"points":1000},{"id":2,"index":2,"name":"Жёлтый пояс","delta":1000,"fight_count":15,"points":2000},{"id":3,"index":3,"name":"Красный пояс","delta":1000,"fight_count":30,"points":3000},{"id":4,"index":4,"name":"Зелёный пояс","delta":1000,"fight_count":100,"points":4000}];
module.exports = Reference;
return module.exports; });