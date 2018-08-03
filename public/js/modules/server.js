function Server() {

    this.listOfStudents = function (cb) {
        $.get('/listOfStudents', cb);
    };

    this.deleteStudent = function (id, cb) {
        $.get('/deleteStudent/' + id, cb);
    };

    this.addStudent = function (name, surname, subgroup, cb) {
        $.get('/addStudent', { name :name, surname: surname, subgroup: subgroup }, cb);
    };

    this.addLesson = function (name, cb) {
        $.get('/addLesson', { name :name }, cb);
    };

    this.listOfLessons = function (cb) {
        $.get('/listOfLessons', cb);
    };

    this.deleteLesson = function (id, cb) {
        $.get('/deleteLesson/' + id, cb);
    };

    this.addSchedule = function (day, time, lesson_id, cb) {
        $.get('/addSchedule', { day :day, time :time, lesson_id :lesson_id }, cb);
    };

    this.listOfSchedule = function (cb) {
        $.get('/listOfSchedule', cb);
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