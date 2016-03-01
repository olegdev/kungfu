define(function() {
var module = {exports: {}};
/**
 * Справочник клиентских сообщений
 *
    id - идентификатор
    key - ключ 
    value - значение
 */
var Reference = {};

/**
 * Вернет данные сообщение по id
 */
Reference.getByKey = function(key) {
	for(var i = 0; i < this.data.length; i++) {
		if (this.data[i].key == key) {
			return this.data[i].value;
		}
	}
}

// послдение строчки обрабатываются grunt'ом, не менять!

Reference.data = [{"id":1,"key":"energy","value":"Энергия"},{"id":2,"key":"rating","value":"Рейтинг"},{"id":3,"key":"all_fights","value":"Всего боев"},{"id":4,"key":"wins","value":"Побед"},{"id":5,"key":"loses","value":"Поражений"},{"id":6,"key":"fights_btn","value":"В бой"},{"id":7,"key":"rating_btn","value":"Рейтинг"},{"id":8,"key":"tournament_btn","value":"Турнир"},{"id":9,"key":"window_title_search","value":"Поиск противника"},{"id":10,"key":"main_title","value":"Словесное Кунг-Фу"},{"id":11,"key":"dictionary_loading_hint","value":"Загрузка словаря.."},{"id":12,"key":"msg_not_active_battle","value":"Бой не активен"},{"id":13,"key":"msg_battle_not_found","value":"Бой не найден"},{"id":14,"key":"msg_invalid_params","value":"Неверные параметры"},{"id":15,"key":"msg_word_not_found","value":"Такого слова нет в словаре"},{"id":16,"key":"window_title_battle_resul_win","value":"Победа!"},{"id":17,"key":"window_title_battle_resul_lose","value":"Поражение.."},{"id":18,"key":"league","value":"Лига"},{"id":19,"key":"new_league_congrats","value":"Поздравляем с новой лигой"},{"id":20,"key":"place_no","value":"не в рейтинге"},{"id":21,"key":"place_top_10","value":"топ 10%"},{"id":22,"key":"place_top_30","value":"топ 30%"},{"id":23,"key":"place_top_50","value":"топ 50%"},{"id":24,"key":"place_under_50","value":"ниже 50%"},{"id":25,"key":"place_title","value":"место"}];
module.exports = Reference;
return module.exports; });