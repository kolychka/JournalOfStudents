function Journal(options) {

    var db = options.db;

// STUDENT  
    this.addStudent = async function(name, surname, lastname, record_book, status) {
        var result = await db.addStudent(name, surname, lastname, record_book, status);
        if (result) {
            return await db.getStudent(name, record_book);
        } else {
            return 'Вероятно, такая запись уже существует.\n' + 
            ' Проверьте вводимые данные.';
        }
        /*return db.addStudent(name, surname, lastname, record_book, status).then(function (result) {
            return (result) ? db.getStudent(name, record_book) : 'Вероятно, такая запись уже существует.\n' + 
            ' Проверьте вводимые данные.';
        });
        await db.addStudent(name, surname, lastname, record_book, status);
        return await db.getStudent(name, record_book);*/
    };

    this.listOfStudents = function() {
        return db.getListOfStudents();
    };

    this.deleteStudent = function(id) {
        return db.deleteStudent(id);
    };

// LESSON
    this.addLesson = async function(name) {
        var result = await db.addLesson(name);
        if (result) {
            return await db.getLesson(name);
        } else {
            return 'Вероятно, такая запись уже существует.\n' + 
            ' Проверьте вводимые данные.';
        }
        /*return db.addLesson(name).then(function() {
            return (result) ? db.getLesson(name) : "Случилась какая-то ошибка, проверьте вводимые данные.";
        });
        await db.addLesson(name);
        return await db.getLesson(name);*/
    };

    this.listOfLessons = function() {
        return db.getListOfLessons();
    };

    this.deleteLesson = function(id) {
        console.log(id, "I am in journal");
        return db.deleteLesson(id);
    };

// SUBGROUP 
    this.addSubgroup = function(name, description, group_code) {
        return db.addSubgroup(name, description, group_code).then(function (result) {
            return (result) ? db.getSubgroup(name, description, group_code) : 'Вероятно, такая запись уже существует. \n' +
            'Проверьте вводимые данные.';
        });
    };

    this.listOfSubgroups = function() {
        return db.getListOfSubgroups();
    };

    this.deleteSubgroup = function(id) {
        return db.deleteSubgroup(id);
    };

///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////

// SCHEDULE
    this.addSchedule = function(time, day, lesson_id, subgroup_id) {
        return db.addSchedule(time, day, lesson_id, subgroup_id).then(function() {
            return db.getSchedule(time, day, lesson_id, subgroup_id);
        });
    };

    this.listOfSchedule = function() {
        return db.getListOfSchedule();
    };

    this.deleteSchedule = function(id) {
        return db.deleteSchedule(id);
    };

// OTHERS    
    this.noteStudents = function(noteList, schedule_id){
        var arr = noteList.split(';');
        var res = [];
        if (arr instanceof Array) {
            for (var i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split(',');
                if (arr2 && arr2[0] && arr2[1]) { //
                    res.push({ id: arr2[0], status: arr2[1]});
                }
            }
        }
        return db.noteStudents(res, schedule_id);
    };

    this.uploadData = function(startDate, finishDate) {
        return db.getUploadData(startDate, finishDate);
    };
}

module.exports = Journal;