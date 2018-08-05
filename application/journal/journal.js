function Journal(options) {

    var db = options.db;

    this.addStudent = async function(name, surname, lastname, record_book, status) {
        return db.addStudent(name, surname, lastname, record_book, status).then(function (result) {
            return (result) ? db.getStudent(name, record_book) : 'Вероятно, такая запись уже существует.\n' + 
            ' Проверьте вводимые данные.';
        });
        await db.addStudent(name, surname, lastname, record_book, status);
        return await db.getStudent(name, record_book);
    };

    this.listOfStudents = function() {
        return db.getListOfStudents();
    };

    this.deleteStudent = function(id) {
        return db.deleteStudent(id);
    };

    this.addLesson = function(name) {
        return db.addLesson(name).then(function() {
            return db.getLesson(name);
        });
    };

    this.listOfLessons = function() {
        return db.getListOfLessons();
    };

    this.deleteLesson = function(id) {
        return db.deleteLesson(id);
    };

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