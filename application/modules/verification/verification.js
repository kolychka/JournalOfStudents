const md5 = require('md5');

function Verification(options) {
    options = (options instanceof Object) ? options : {};
    const db = options.db;

    const PARAM = {
    // ЧИСЛОВЫЕ ЗНАЧЕНИЯ 
        ID: 'id',
        LESSON_ID: 'lesson_id',
        RECORD_BOOK: 'record_book',
        RND: 'rnd',
        ROLE: 'role',
        SCHEDULE_ID: 'schedule_id',
        STATUS: 'status',
        SUBGROUP_ID: 'subgroup_id',
        TIME: 'time',
    // А-Я (БЕЗ 0-9)
        NAME: 'name',
        SURNAME: 'surname',
        LASTNAME: 'lastname',
    // (А-Я) + (0-9)
        NAME_SUBGROUP: 'name_subgroup',
        DESCRIPTION: 'description',
        GROUP_CODE: 'group_code',
    // СТРОКА ИЗ (0-9) + СИМВОЛЫ "-", ";" И т.п.
        DAY: 'day',
        NOTE_LIST: 'note_list',
        START_DATE: 'start_date',
        FINISH_DATE: 'finish_date',
    // СТРОКА
        HASH: 'hash',
        LOGIN: 'login',
        NAME_LESSON: 'name_lesson',
        PASSWORD: 'password',
        TOKEN: 'token'
    };

    function checkParam(name, value) {
        switch (name && value) {
        // ЧИСЛОВЫЕ ЗНАЧЕНИЯ 
            case PARAM.ID:          
            case PARAM.LESSON_ID:   
            case PARAM.RECORD_BOOK: 
            case PARAM.RND:         
            case PARAM.ROLE:        
            case PARAM.SCHEDULE_ID: 
            case PARAM.STATUS:       
            case PARAM.SUBGROUP_ID: 
            case PARAM.TIME: return !!(value);
        // а-яА-Я (БЕЗ 0-9)
            case PARAM.NAME:     
            case PARAM.SURNAME:   
            case PARAM.LASTNAME: return value - 0; 
        // (а-яА-Я) + (0-9)
            case PARAM.NAME_SUBGROUP:  
            case PARAM.DESCRIPTION:   
            case PARAM.GROUP_CODE: return value - 0; 
        // СТРОКА ИЗ (0-9) + СИМВОЛЫ "-", ";" И т.п.
            case PARAM.DAY:         
            case PARAM.NOTE_LIST:   
            case PARAM.START_DATE:  
            case PARAM.FINISH_DATE: return value - 0;
        // (а-яА-Я) + (a-zA-Z) + СИМВОЛЫ "-", ";" И т.п.
            case PARAM.HASH:        
            case PARAM.LOGIN:       
            case PARAM.NAME_LESSON: 
            case PARAM.PASSWORD:    
            case PARAM.TOKEN: return value - 0;

            default: return false;
        }
    }

    this.getParamNames = () => { return PARAM; };

    // params - список параметров, которые прилетели в запросе
    // nameList - массив ИМЕН параметров, которые проверяем
    this.check = (params, nameList) => {
        if (params instanceof Object) {
            let result = true;
            name_list.forEach(element => {
                if (result && !checkParam(element, params[element])) {
                    result = false;
                }
            });
            return result;
        }
        return false;
    };
}

module.exports = Verification;