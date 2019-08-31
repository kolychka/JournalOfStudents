const sqlite3 = require('sqlite3').verbose();

function DB() {
    let db;

// STUDENT
    this.getStudentByName = (name, record_book) => { 
        return new Promise((resolve, reject) => { 
            db.serialize(() => { 
                if (name, record_book) {
                    db.get('SELECT * FROM student WHERE name=? AND record_book=?', [name, record_book], (err, row) => resolve((err) ? null : row));
                }
            }); 
        }); 
    };

    this.getStudentById = (id) => { 
        return new Promise((resolve, reject) => { 
            db.serialize(() => { 
                if (id) {
                    db.get('SELECT * FROM student WHERE id=?', [id], (err, row) => resolve((err) ? null : row));
                } 
            }); 
        }); 
    };

    this.addStudent = (name, surname, lastname, record_book, status) => {
        return new Promise((resolve,reject) => {
            const query = "INSERT INTO student (name, surname, lastname, record_book, status) VALUES (?, ?, ?, ?, ?)";
            db.run(query, [name, surname, lastname, record_book, status], err => resolve(!err));
        });
    };

    this.updateStudent = (id, params) => {
        return new Promise((resolve,reject) => {
            let str = [];
            let arr =[];
            for (let key in params) {
                str.push(key + " = ?");
                arr.push(params[key]);
            }
            arr.push(id);
            const query = "UPDATE student SET " + str.join(', ') + " WHERE id = ?";
            db.run(query, arr, err => resolve(!err));
        });
    };

    this.getListOfStudents = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT * FROM student", (err, rows) => resolve((err) ? null : rows));
            });
        });
    };

    this.deleteStudent = (id) => { 
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
    this.getLessonByName = (name_lesson) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = "SELECT * FROM lesson WHERE name=?";
                db.get(query, [name_lesson], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.getLessonById = (id) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = "SELECT * FROM lesson WHERE id=?";
                db.get(query, [id], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.addLesson = (name_lesson) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO lesson (name) VALUES (?)", [name_lesson], err => resolve(!err));
        });
    };

    this.updateLesson = (id, name_lesson) => {
        return new Promise((resolve,reject) => {
            const query = "UPDATE lesson SET name = ? WHERE id = ?";
            db.run(query, [name_lesson, id], err => resolve(!err));
        });
    };

    this.getListOfLessons = () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT * FROM lesson", (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.deleteLesson = (id) => { 
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
    this.getSubgroupByName = (name) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get("SELECT * FROM subgroup WHERE name=?", [name], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.getSubgroupById = (id) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get("SELECT * FROM subgroup WHERE id=?", [id], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.addSubgroup = (name_subgroup, user_id, description, group_code) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO subgroup (name, user_id, description, group_code) VALUES (?, ?, ?, ?)";
            db.run(query, [name_subgroup, user_id, description, group_code], err => resolve(!err));
        });
    };

    this.updateSubgroup = (id, params) => {
        return new Promise((resolve, reject) => {
            let str = [];
            let arr = [];
            for (let key in params) {
                str.push(key + " = ?");
                arr.push(params[key]);
            }
            arr.push(id);
            const query = "UPDATE subgroup SET " + str.join(', ') + " WHERE id = ?";
            console.log(query);
            db.run(query, arr, err => resolve(!err));
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
    this.getUser = (login) => {
        return new Promise((resolve, reject) => { 
            db.get('SELECT * FROM user WHERE login= ?', [login], (err, row) => resolve((err) ? null : row)); 
        });
    };

    this.getUserByToken = (token) => {
        return new Promise((resolve, reject) => { 
            db.get('SELECT * FROM user WHERE token= ?', [token], (err, row) => resolve((err) ? null : row)); 
        });
    };

    this.getUserById = (id) => {
        return new Promise((resolve, reject) => { 
            db.get('SELECT * FROM user WHERE id= ?', [id], (err, row) => resolve((err) ? null : row)); 
        });
    };

    this.updateUserToken = (id, token) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE user SET token = ? WHERE id = ?", [token, id], err => resolve(!err));
        });
    };

    this.addUser = (role, name, login, password) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO user (role, name, login, password) VALUES (?, ?, ?, ?)";
            db.run(query, [role, name, login, password], function (err) {
                resolve(!(err));
            });
        });
    };

    this.updateUser = (token, params) => {
        return new Promise((resolve, reject) => {
            let str = [];
            let arr = [];
            for (let key in params) {
                str.push(key + " = ?");
                arr.push(params[key]);
            }
            arr.push(token);
            const query = "UPDATE user SET " + str.join(', ') + " WHERE token = ?";
            db.run(query, arr, err => resolve(!err));
        });
    };

    this.updateUserPassword = (id, password) => {
        return new Promise((resolve,reject) => {
            const query = "UPDATE user SET password = ? WHERE id = ?";
            db.run(query, [password, id], err => resolve(!err));
        });
    };

    this.getListOfUsers = () => {
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
    this.getScheduleByParams = (time, day, lesson_id, subgroup_id) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = 'SELECT * FROM schedule WHERE time=? AND day=? AND lesson_id=? AND subgroup_id=?';
                db.get(query, [time, day, lesson_id, subgroup_id], (err, row) => resolve((err) ? null : row));
            });
        });
    };

    this.getScheduleById = (id) => { 
        return new Promise((resolve, reject) => { 
            db.serialize(() => { 
                if (id) {
                    db.get('SELECT * FROM schedule WHERE id=?', [id], (err, row) => resolve((err) ? null : row));
                } 
            }); 
        }); 
    };

    this.addSchedule = (time, day, lesson_id, subgroup_id) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO schedule (time, day, lesson_id, subgroup_id) VALUES (?, ?, ?, ?)";
            db.run(query, [time, day, lesson_id, subgroup_id], err => resolve(!err));
        });
    };

    this.updateSchedule = (id, params) => {
        return new Promise((resolve, reject) => {
            let str = [];
            let arr = [];
            for (let key in params) {
                str.push(key + " = ?");
                arr.push(params[key]);
            }
            arr.push(id);
            const query = "UPDATE schedule SET " + str.join(', ') + " WHERE id = ?";
            db.run(query, arr, err => resolve(!err));
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

    this.deleteSchedule = (id) => {
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
    this.noteStudents = (studentsList, schedule_id) => {
        return new Promise(function(resolve, reject) {
            if (studentsList && studentsList.length && schedule_id) {
                str = [];
                arr = [];
                for (let i = 0; i < studentsList.length; i++) {
                    str.push('(?, ?, ?)');
                    arr.push(schedule_id);
                    arr.push(studentsList[i].id);
                    arr.push(studentsList[i].status);
                }
                str = str.join(',');
                let query = "INSERT INTO journal (schedule_id, student_id, status) VALUES " + str;
                db.run(query, arr, function (err) {
                    resolve(!(err));
                });
            } else {
                resolve(null);
            }
        });
    };

    this.getUploadData = (start_date, finish_date) => {
        return new Promise((resolve, reject) => {
            db.serialize(function () {
                let query = "SELECT student.name, " + 
                                    "student.lastname, " + 
                                    "student.surname, " + 
                                    "journal.status, " + 
                                    "schedule.day, " + 
                                    "schedule.time, " + 
                                    "lesson.name AS lessonName, " + 
                                    "subgroup.name AS subgroupName " +
                            "FROM student " +
                                "INNER JOIN journal on student.id = journal.student_id " +
                                "INNER JOIN schedule on schedule.id = journal.schedule_id AND schedule.day BETWEEN '" + 
                                    start_date + 
                                    "' AND '" + 
                                    finish_date + "' " +
                                "INNER JOIN lesson on lesson.id = schedule.lesson_id " + 
                                "INNER JOIN subgroup on subgroup.id = schedule.subgroup_id";
                db.all(query, (err, row) => { resolve((err) ? null : row); });
            });
        });
    };

    this.deinit = () => {
        if (db) {
            db.close();
            db = null;
        }
    };

    function init() {
        db = new sqlite3.Database(__dirname + '\\journal.db');
    }
    init();
}

module.exports = DB;