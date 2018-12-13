function Errors(options) {
    options = (options instanceof Object) ? options : {};

    const TEXT = {
        2001: 'Вероятно, такая запись уже существует. Проверьте вводимые данные.',
        2002: 'Ошибка при указании параметра(-ов).',
        2003: 'Неудачная авторизация.',
        2004: 'Вероятно, произошла ошибка. Проверьте вводимые данные.',
        2005: 'Неверный путь.',
        2006: 'Неудачный выход'
    }

    this.get = (num) => {
        return (TEXT[num]) ? TEXT[num] : 'unknown error';
    };
}

module.exports = Errors;