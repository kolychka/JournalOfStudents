'use strict';

var express = require('express');

function Router(options) {
    var router = express.Router();
    var journal = options.journal;

    /*
    //User:
        addUser; // + пользователь
        deleteUser; // - пользователь
        listOfUsers; // вывод списка пользователей

    //Subgroup:
        (+)  addSubgroup; // + подгруппа
        deleteSubgroup; // - подгруппа
        (+)  listOfSubgroups; // вывод списка подгрупп

    //Student:
        (+)  addStudent; // + студент
        (+)  deleteStudent; // - студент
        (+)  listOfStudents; // вывод списка студентов

    //Lesson:
        (+)  addLesson; // + дисциплина
        (+)  deleteLesson; // - дисциплина
        (+)  listOfLessons; // вывод списка дисциплин

    //Schedule:    
        (+)  addSchedule; // + пара
        (+)  listOfSchedule; // вывод списка занятий
        (+)  deleteSchedule; // - пара

    //Journal:
        deleteNotes;
        (+)  noteStudents; // отметить студентов
        (+)  uploadData; // выгрузить данные attendance
    */

// STUDENT
    router.get('/addStudent', async function(req, res) {
        var name = req.query.name;
        var surname = req.query.surname;
        var lastname = req.query.lastname;
        var record_book = req.query.record_book;
        var status = req.query.status;
        if (name && record_book) {
        	res.send(await journal.addStudent(name, surname, lastname, record_book, status));
        } else {
            res.send('not enough parameters');
        }
    });

    router.get('/listOfStudents', async function(req, res) {
        res.send(await journal.listOfStudents());
    });

    router.get('/deleteStudent/:id', async function(req, res) {
        var id = req.params.id - 0;
        if (!isNaN(id)) {
            res.send(await journal.deleteStudent(id));
        } else {
            res.send('not enough id parameter');
        }
    });

// LESSON   
    router.get('/addLesson', async function (req, res){
        var name = req.query.name;
        if (name) {
            res.send(await journal.addLesson(name));
        } else {
            res.send('not enough parameter');
        }
    });
 
    router.get('/listOfLessons', async function(req, res) {
        res.send(await journal.listOfLessons());
    });

    router.get('/deleteLesson/:id', async function(req, res) {
        var id = req.params.id - 0;
        console.log(id, "i am in router 1");
        if (!isNaN(id)) {
            console.log(id, "i am in router 2");
            res.send(await journal.deleteLesson(id));
        } else {
            console.log(id, "i am in router 1");
            res.send('not enough id parameter');
        }
    });

// SUBGROUP 
    router.get('/addSubgroup', function(req, res) {
        var name = req.query.name;
        var description = req.query.description;
        var group_code = req.query.group_code;
        if (name) {
            journal.addSubgroup(name, description, group_code).then(function (result) {
                res.send(result);
            });
        } else {
            res.send('not enough parameters');
        }
    });
    
    router.get('/listOfSubgroups', function(req, res) {
        journal.listOfSubgroups().then(function (list) {
            res.send(list);
        });
    });
    
    router.get('/deleteSubgroup/:id', function(req, res) { 
        var id = req.params.id - 0;
        if (id) {
            journal.deleteSubgroup(id).then((result) => res.send(result));
        } else {
            res.send('not enough id parameter');
        }
    });

///////////////////////////////////////////////////////////////////////////

    /*router.get('/addUser', async function(req, res) {
        var role = req.query.role;
        var name = req.query.name;
        var login = req.query.login;
        var password = req.query.password;
        //var token = req.query.token;
        if (role && name && login && password) {
            res.send(await journal.addStudent(role, name, lastname, login, password))
        } else {
            res.send('not enough parameters');
        }
    });*/

///////////////////////////////////////////////////////////////////////////

// SCHEDULE
    router.get('/addSchedule', function(req, res) {
        var time = req.query.time;
        var day = req.query.day;
        var lesson_id = req.query.lesson_id - 0;
        var subgroup_id = req.query.subgroup_id - 0;
        if (time && day && !isNaN(lesson_id) && !isNaN(subgroup_id)) {
            journal.addSchedule(time, day, lesson_id, subgroup_id).then(function (result) {
                res.send(result);
            });
        } else {
            res.send('not enough parameters');
        }
    });

    router.get('/listOfSchedule', function(req, res) {
        journal.listOfSchedule().then(function (list) {
            res.send(list);
        });
    });

    router.get('/deleteSchedule/:id', function(req, res) {
        var id = req.params.id - 0;
        if (!isNaN(id)) {
            journal.deleteSchedule(id).then((result) => res.send(result));
        } else {
            res.send('not enough id parameter');
        }
    });

// OTHERS    
    // метод про ОТМЕТИТЬ студентов; пример строки - 1,0;2,1;3,0;4,1
    router.get('/noteStudents', function(req, res) {
        var noteList = req.query.noteList;
        var scheduleId = req.query.scheduleId;
        if (noteList && scheduleId) {
            journal.noteStudents(noteList, scheduleId).then(function (result) {
                res.send(result);
            });
        } else {
            res.send('not enough parameters');
        }
    });

    router.get('/uploadData', function(req, res) {
        var startDate = req.query.startDate;
        var finishDate = req.query.finishDate;
        if (startDate && finishDate && (startDate <= finishDate)) {
            journal.uploadData(startDate, finishDate).then(function (data) {
                res.send(data);
            });
        } else  if (startDate && !finishDate) {
            var date = new Date();
            var values = [ date.getDate(), date.getMonth() + 1 ];
            for( var id in values ) {
                values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
            }
            finishDate = date.getFullYear() + '-' + values[ 1 ] + '-' + values[ 0 ];
            journal.uploadData(startDate, finishDate).then(function (data) {
                res.send(data);
            });
        }
        else {
            res.send('not enough parameters');
        }
    });

    router.all('/*', function(req, res) {
        res.send('wrong way');
    });

    return router;
}

module.exports = Router;