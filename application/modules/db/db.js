var sqlite3 = require('sqlite3').verbose();

function DB() {
    var db;

// STUDENT
    this.getStudent = (name, record_book) => { 
        return new Promise((resolve, reject) => { 
            db.serialize(() => { 
                db.get('SELECT * FROM student WHERE name=? AND record_book=?', [name, record_book], (err, row) => resolve((err) ? null : row));
            }); 
        }); 
    };

    this.addStudent = (name, surname, lastname, record_book, status) => {
        return new Promise((resolve,reject) => {
            const query = "INSERT INTO student (name, surname, lastname, record_book, status) VALUES (?, ?, ?, ?, ?)";
            db.run(query, [name, surname, lastname, record_book, status], err => resolve(!err));
        });
    };

    this.getListOfStudents = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT * FROM student", (err, rows) => resolve((err) ? null : rows));
            });
        });
    };

    this.deleteStudent = (id) => { // работает, но вариант старый
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM journal WHERE student_id=?" , [id], err => { 
                (!err) ? 
                    db.run("DELETE FROM student_subgroup WHERE id=?", [id], err => { 
                        (!err) ? 
                            db.run("DELETE FROM student WHERE id=?", [id], err => resolve(!err))
                            : resolve(false);
                    })
                    : resolve(false);
            });
        });
    };  

// LESSON    
    this.getLesson = (name) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = "SELECT * FROM lesson WHERE name=?";
                db.get(query, [name], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.addLesson = (name) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO lesson (name) VALUES (?)", [name], err => resolve(!err));
        });
    };

    this.getListOfLessons = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT * FROM lesson", (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.deleteLesson = (id) => { //работает 
        return new Promise((resolve, reject) => { 
            db.run("DELETE FROM journal WHERE schedule_id = (SELECT id FROM schedule WHERE lesson_id=?)", [id], err => {
                (!err) ? 
                    db.run("DELETE FROM schedule WHERE lesson_id=?", [id], err => {
                        (!err) ? 
                            db.run("DELETE FROM lesson_subgroup WHERE lesson_id=?", [id], err => {
                                (!err) ? 
                                    db.run("DELETE FROM lesson WHERE id=?", [id], async err => {
                                        if (!err) {
                                            await this.deleteSchedule(id);
                                            resolve(!err);
                                        } else {
                                            resolve(false);
                                        }
                                    })
                                    : resolve(false);
                            })
                            : resolve(false);
                    })
                    : resolve(false);
            });
        }); 
    };
   
// SUBGROUP    
    this.getSubgroup = (name) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get("SELECT * FROM subgroup WHERE name=?", [name], (err, row) => resolve((err) ? null : row));
            });
        })
    };

    this.addSubgroup = (name, description, group_code) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO subgroup (name, description, group_code) VALUES (?, ?, ?)";
            db.run(query, [name, description, group_code], err => resolve(!err));
        });
    };

    this.getListOfSubgroups = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT * FROM subgroup", (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.deleteSubgroup = (id) => {
        return new Promise(async(resolve, reject) => {
            db.run("DELETE FROM journal WHERE schedule_id = (SELECT id FROM schedule WHERE subgroup_id=?)", [id], err => {
                (!err) ? 
                    db.run("DELETE FROM schedule WHERE subgroup_id=?", [id], err => {
                        (!err) ? 
                            db.run("DELETE FROM lesson_subgroup WHERE subgroup_id=?", [id], err => {
                                (!err) ? 
                                    db.run("DELETE FROM subgroup WHERE id=?", [id], async err => {
                                        if (!err) {
                                            await this.deleteSchedule(id);
                                            resolve(!err);
                                        } else {
                                            resolve(false);
                                        }
                                    })
                                    : resolve(false);
                            })
                            : resolve(false);
                    })
                    : resolve(false);
            });
        });
    };

// USER
    this.getUser = (role, name) => { 
        return new Promise((resolve, reject) => { 
            db.serialize(() => { 
                db.get('SELECT * FROM user WHERE role=? AND name=?', [role, name], (err, row) => resolve((err) ? null : row)); 
            }); 
        }); 
    };

    this.addUser = function (role, name, login, password) {
        return new Promise((resolve,reject) => {
            const query = "INSERT INTO user (role, name, login, password) VALUES (?, ?, ?, ?)";
            db.run(query, [role, name, login, password], function (err) {
                resolve(!(err));
            });
        });
    };

    this.getListOfUsers = function() {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT * FROM user", (err, row) => { resolve((err) ? null : row); });
            });
        });
    };

    this.deleteUser = (id) => { 
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM user WHERE id=?", [id], err => resolve(!err)); 
        });
    };

// SCHEDULE    
    this.getSchedule = (time, day, lesson_id, subgroup_id) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = 'SELECT * FROM schedule WHERE time=? AND day=? AND lesson_id=? AND subgroup_id=?';
                db.get(query, [time, day, lesson_id, subgroup_id], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.addSchedule = (time, day, lesson_id, subgroup_id) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO schedule (time, day, lesson_id, subgroup_id) VALUES (?, ?, ?, ?)";
            db.run(query, [time, day, lesson_id, subgroup_id], err => resolve(!err));
        });
    };

    this.getListOfSchedules = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = "SELECT schedule.id AS scheduleId, " +
                                    "schedule.day AS scheduleDay, " +
                                    "schedule.time AS scheduleTime, " +
                                    "lesson.name AS lessonName, " +
                                    "subgroup.name AS subgroupName " +
                                "FROM schedule " +
                                    "INNER JOIN lesson ON schedule.lesson_id = lesson.id " +
                                    "INNER JOIN subgroup ON schedule.subgroup_id = subgroup.id " +
                                "ORDER BY schedule.day, schedule.time ASC;"
                db.all(query, (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.deleteSchedule = function (id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM journal WHERE schedule_id=?", [id], err => {
                (!err) ?
                    db.run("DELETE FROM schedule WHERE id=?", [id], err => {
                        (!err) ? resolve(!err) : resolve(result);
                    })
                    : resolve(result); 
            });
        });
    };

// OTHERS    
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
        return new Promise((resolve, reject) => {
            db.serialize(function () {
                var query = "SELECT student.name, " + 
                                    "student.lastname, " + 
                                    "student.surname, " + 
                                    "journal.status, " + 
                                    "schedule.day, " + 
                                    "schedule.time, " + 
                                    "lesson.name AS lessonName, " + 
                                    "subgroup.name AS subgroupName " +
                            "FROM student " +
                                "INNER JOIN journal on student.id = journal.student_id " +
                                "INNER JOIN schedule on schedule.id = journal.schedule_id AND schedule.day BETWEEN '" + startDate + "' AND '" + finishDate + "' " +
                                "INNER JOIN lesson on lesson.id = schedule.lesson_id " + 
                                "INNER JOIN subgroup on subgroup.id = schedule.subgroup_id";
                    db.all(query, (err, row) => { resolve((err) ? null : row); });
            });
        });
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