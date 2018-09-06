function Server() {

    this.addStudent = function (name, surname, lastname, record_book, status, cb) {
        $.get('/addStudent', { name: name, surname: surname, lastname: lastname, record_book: record_book, status: status }, cb);
    };

    this.listOfStudents = function (cb) {
        $.get('/listOfStudents', cb);
    };

    this.deleteStudent = function (id, cb) {
        $.get('/deleteStudent/' + id, cb);
    };

    this.addLesson = function (name, cb) {
        $.get('/addLesson', { name: name }, cb);
    };

    this.listOfLessons = function (cb) {
        $.get('/listOfLessons', cb);
    };

    this.deleteLesson = function (id, cb) {
        $.get('/deleteLesson/' + id, cb);
    };

    this.addSubgroup = function (name, description, group_code, cb) {
        $.get('/addSubgroup', { name: name, description: description, group_code: group_code }, cb);
    };

    this.listOfSubgroups = function (cb) {
        $.get('/listOfSubgroups', cb);
    };

    this.deleteSubgroup = function (id, cb) {
        $.get('/deleteSubgroup/' + id, cb);
    };

    this.addUser = function (role, name, login, password, cb) {
        $.get('/addUser', { role: role, name: name, login: login, password: password }, cb);
    };

    this.listOfUsers = function (cb) {
        $.get('/listOfUsers', cb);
    };

    this.deleteUser = function (id, cb) {
        $.get('/deleteUser/' + id, cb);
    };

    this.addSchedule = function (time, day, lesson_id, subgroup_id, cb) {
        $.get('/addSchedule', { day :day, time :time, lesson_id :lesson_id, subgroup_id: subgroup_id }, cb);
    };

    this.listOfSchedules = function (cb) {
        $.get('/listOfSchedules', cb);
    };

    this.deleteSchedule = function (id, cb) {
        $.get('/deleteSchedule/' + id, cb);
    };

    this.noteStudents = function (noteList, scheduleId, cb) {
        $.get('/noteStudents', { noteList : noteList, scheduleId : scheduleId }, cb);
    };

    this.uploadData = function (cb) {
        $.get('/uploadData', cb);
    };
}