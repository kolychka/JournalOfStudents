function Verification(options) {
    options = (options instanceof Object) ? options : {};

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
        USER_ID: 'user_id',
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
    // СТРОКА (0-9) + (a-zA-Z)
        HASH: 'hash',
        TOKEN: 'token',
    // СТРОКА
        LOGIN: 'login',
        NAME_LESSON: 'name_lesson',
        PASSWORD: 'password'
    };

    function checkParam(name, value) {
        switch (value && name) {
        // ЧИСЛОВЫЕ ЗНАЧЕНИЯ 
            case PARAM.ID:          
            case PARAM.LESSON_ID:   
            case PARAM.RECORD_BOOK: 
            case PARAM.RND:         
            case PARAM.ROLE:        
            case PARAM.SCHEDULE_ID: 
            case PARAM.STATUS:       
            case PARAM.SUBGROUP_ID: 
            case PARAM.TIME: 
            case PARAM.USER_ID: return !!(value - 0);
        // а-яА-Я (БЕЗ 0-9)
            case PARAM.NAME:  
            case PARAM.SURNAME:   
            case PARAM.LASTNAME: return checkLiteral(value); 
        // (а-яА-Я) + (0-9) + СИМВОЛЫ "(", ")", "-", "." //чтобы можно было, как в документах, набрать "ОАБ-09.03.02-31(20)"
            case PARAM.NAME_SUBGROUP:  
            case PARAM.DESCRIPTION:   
            case PARAM.GROUP_CODE: return checkLiteralNumberSpec(value); 
        // СТРОКА ИЗ (0-9) + СИМВОЛЫ "-", ";" И т.п.
            case PARAM.DAY:         
            case PARAM.NOTE_LIST:   
            case PARAM.START_DATE:  
            case PARAM.FINISH_DATE: return checkNumberSpec(value);
        // СТРОКА (0-9) + (a-zA-Z)
            case PARAM.HASH:        
            case PARAM.TOKEN: return checkEnNumber(value);    
        // СТРОКА  
            case PARAM.NAME_LESSON:
            case PARAM.PASSWORD:    
            case PARAM.LOGIN: return checkString(value);

            default: return false;
        }
    }

// а-яА-Я (БЕЗ 0-9)
    function checkLiteral(value) {
        let pattern = new RegExp(/^[а-яёА-ЯЁ]+$/);
        return value ? pattern.test(value) : false;
    };
// (а-яА-Я) + (0-9)
    function checkLiteralNumberSpec(value) {
        let pattern = new RegExp(/^[а-яёА-ЯЁ0-9\.\-\(\)]+$/);
        return value ? pattern.test(value) : false;
    };
// СТРОКА ИЗ (0-9) + СИМВОЛЫ "-", ";" И т.п.
    function checkNumberSpec(value) {
        let pattern = new RegExp(/^[0-9]+[,-;]+$/);
        return value ? pattern.test(value) : false;
    };
// СТРОКА (0-9) + (a-zA-Z)
    function checkEnNumber(value) {
        let pattern = new RegExp(/^[a-zA-Z0-9]+$/);
        return value ? pattern.test(value) : false;
    };
// СТРОКА
    function checkString(value) {
        return (typeof value === "string");
    }

    this.getParamNames = () => { return PARAM; };

    // params - список параметров, которые прилетели в запросе
    // nameList - массив ИМЕН параметров, которые проверяем
    this.check = (params, nameList) => {
        if (params instanceof Object) {
            let result = true;
            nameList.forEach(element => {
                console.log("verification", params, element, params[element]);
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