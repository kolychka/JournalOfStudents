var q = require('q');
var sqlite3 = require('sqlite3').verbose();

function DB() {
    var db;

    this.getStudent = function(name, record_book) {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT * FROM student WHERE name=? AND record_book=?";
            db.get(query, [name, record_book], function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.addStudent = function (name, surname, lastname, record_book, status) {
        var deferred = q.defer();
        var query = "INSERT INTO student (name, surname, lastname, record_book, status) VALUES (?, ?, ?, ?, ?)";
        db.run(query, [name, surname, lastname, record_book, status], function (err) {
            deferred.resolve(!(err));
        });
        return deferred.promise;
    };

    this.getListOfStudents = function() {
        /*var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT * FROM student";
            db.all(query, function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;*/
        return new Promise((resolve, reject) => {
            db.serialize(() => {
            const query = "SELECT * FROM student";
            db.all(query, (err, rows) => { resolve((err) ? null : rows); });
             });
        });
    };

    this.deleteStudent = function (id) {
        var deferred = q.defer();
        db.run("DELETE FROM journal WHERE student_id=?", [id], function(err){
            if (!err) {
                db.run("DELETE FROM student_subgroup WHERE id=?", [id], function (err) {
                    deferred.resolve(!(err));
                });
                if (!err) {
                    db.run("DELETE FROM student WHERE id=?", [id], function (err) {
                        deferred.resolve(!(err));
                    });
                } else {
                    deferred.resolve(false);
                }
            }
        });
        return deferred.promise;
    };

    this.getLesson = function(name) {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT * FROM lesson WHERE name=?";
            db.get(query, [name], function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.addLesson = function (name) {
        var deferred = q.defer();
        var query = "INSERT INTO lesson (name) VALUES (?)";
        db.run(query, [name], function (err) {
            deferred.resolve(!(err));
        });
        return deferred.promise;
    };

    this.getListOfLessons = function() {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT * FROM lesson";
            db.all(query, function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.deleteLesson = function (id) {
        var deferred = q.defer();
        db.run("DELETE FROM schedule WHERE lesson_id=?", [id], function(err){
            if (!err) {
                db.run("DELETE FROM lesson WHERE id=?", [id], function (err) {
                    deferred.resolve(!(err));
                });
            } else {
                deferred.resolve(false);
            }
        });
        return deferred.promise;
    };

///////////////////////////////////////////////////////////////////////////

    this.getSubgroup = function(name, description, group_code) {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT * FROM subgroup WHERE name=?";
            db.get(query, [name], function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.addSubgroup = function (name, description, group_code) {
        var deferred = q.defer();
        var query = "INSERT INTO subgroup (name, description, group_code) VALUES (?, ?, ?)";
        db.run(query, [name, description, group_code], function (err) {
            deferred.resolve(!(err));
        });
        return deferred.promise;
    };


///////////////////////////////////////////////////////////////////////////

    this.getSchedule = function(time, day, lesson_id, subgroup_id) {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT * FROM schedule WHERE time=? AND day=? AND lesson_id=? AND subgroup_id=?";
            db.get(query, [time, day, lesson_id, subgroup_id], function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.listOfSchedule = function() {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT schedule.id AS scheduleId, schedule.day, schedule.time, lesson.name\n" +
                "FROM schedule\n" +
                "INNER JOIN lesson ON schedule.lesson_id = lesson.id \n" +
                "ORDER BY schedule.day, schedule.time ASC";
            db.all(query, function (err, row) { deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.addSchedule = function (time, day, lesson_id) {
        var deferred = q.defer();
        var query = "INSERT INTO schedule (day, time, lesson_id) VALUES (?, ?, ?)";
        db.run(query, [day, time, lesson_id], function (err) {
            deferred.resolve(!(err));
        });
        return deferred.promise;
    };

    this.deleteSchedule = function (id) {
        var deferred = q.defer();
        db.run("DELETE FROM journal WHERE schedule_id=?", [id], function(err){
            if (!err) {
                db.run("DELETE FROM schedule WHERE id=?", [id], function (err) {
                    deferred.resolve(!(err));
                });
            } else {
                deferred.resolve(false);
            }
        });
        return deferred.promise;
    };

    this.noteStudents = function (studentsList, schedule_id) {
        return new Promise(function(resolve, reject) {
            if (studentsList && studentsList.length && schedule_id) {
                str = [];
                arr = [];
                for (var i = 0; i < studentsList.length; i++) {
                    str.push('(?, ?, ?)');
                    arr.push(schedule_id);
                    arr.push(studentsList[i].id);
                    arr.push(studentsList[i].status);
                }
                str = str.join(',');
                var query = "INSERT INTO journal (schedule_id, student_id, status) VALUES " + str;
                db.run(query, arr, function (err) {
                    resolve(!(err));
                });
            } else {
                resolve(null);
            }
        });
    };

    this.getUploadData = function(startDate, finishDate) {
        var deferred = q.defer();
        db.serialize(function () {
            var query = "SELECT student.surname, journal.status, schedule.day, schedule.time, lesson.name " +
                "FROM student " +
                "INNER JOIN journal on student.id = journal.student_id " +
                "INNER JOIN schedule on schedule.id = journal.schedule_id AND " +
                "schedule.day BETWEEN '" + startDate + "' AND '" + finishDate + "' " +
                "INNER JOIN lesson on lesson.id = schedule.lesson_id";
                db.all(query, function (err, row) { console.log(err, row); deferred.resolve((err) ? null : row); });
        });
        return deferred.promise;
    };

    this.deinit = function () {
        if (db) {
            db.close();
            db = null;
        }
    };

    // init
    function init() {
        db = new sqlite3.Database(__dirname + '\\journal.db');
    }
    init();
}

module.exports = DB;

// http://localhost:3000/noteStudents?kind=lec&timetable_id=1&student_id=1&status=y
// http://zametkinapolyah.ru/zametki-o-mysql/chast-12-14-obedinenie-tablic-v-sql-i-bazax-dannyx-sqlite-join-i-select.html
// http://localhost:3000/addLesson?name=djkha
// C:\listofstudents\application\modules\db