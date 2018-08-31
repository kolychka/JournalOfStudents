'use strict';

var express = require('express');

function Router(options) {
    var router = express.Router();
    var journal = options.journal;

    /* прототипы; переписать все delete, кроме deleteLesson
    //User:
        (+)  addUser; // + пользователь
        (+)  listOfUsers; // вывод списка пользователей
        (сломан)  deleteUser; // - пользователь

    //Subgroup:
        (+)  addSubgroup; // + подгруппа
        (сломан)  deleteSubgroup; // - подгруппа
        (+)  listOfSubgroups; // вывод списка подгрупп

    //Student:
        (+)  addStudent; // + студент
        (старый)  deleteStudent; // - студент
        (+)  listOfStudents; // вывод списка студентов

    //Lesson:
        (+)  addLesson; // + дисциплина
        (+)  deleteLesson; // - дисциплина
        (+)  listOfLessons; // вывод списка дисциплин

    //Schedule:    
        (+)  addSchedule; // + пара
        (+)  listOfSchedule; // вывод списка занятий
        (не хочу переписывать)  deleteSchedule; // - пара

    //Journal:      ПЕРЕПИСАТЬ ПОД НОВУЮ БД
        deleteNotes; // удалить отметки какого-то занятия
        noteStudents; // отметить студентов
        uploadData; // выгрузить данные attendance
    */

// STUDENT
    router.get('/addStudent', async function(req, res) {
        var name = req.query.name;
        var surname = req.query.surname;
        var lastname = req.query.lastname;
        var record_book = req.query.record_book;
        var status = req.query.status;
        if (name && record_book) {
            const result = await journal.addStudent(name, surname, lastname, record_book, status);
            res.send((result) ? result : 'Вероятно, такая запись уже существует. Проверьте вводимые данные.');
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
            const result = await journal.addLesson(name);
            res.send((result) ? result : 'Вероятно, такая запись уже существует. Проверьте вводимые данные.');
        } else {
            res.send('not enough parameter');
        }
    });
 
    router.get('/listOfLessons', async function(req, res) {
        res.send(await journal.listOfLessons());
    });

    router.get('/deleteLesson/:id', async function(req, res) {
        var id = req.params.id - 0;
        if (!isNaN(id)) {
            res.send(await journal.deleteLesson(id));
        } else {
            res.send('not enough id parameter');
        }
    });

// SUBGROUP 
    router.get('/addSubgroup', async function(req, res) {
        var name = req.query.name;
        var description = req.query.description;
        var group_code = req.query.group_code;
        if (name) {
            const result = await journal.addSubgroup(name, description, group_code);
            res.send((result) ? result : 'Вероятно, такая запись уже существует. Проверьте вводимые данные.');
        } else {
            res.send('not enough parameters');
        }
    });
    
    router.get('/listOfSubgroups', async function(req, res) {
        res.send(await journal.listOfSubgroups());
    });
    
    router.get('/deleteSubgroup/:id', async function(req, res) { 
        var id = req.params.id - 0;
        if (!isNaN(id)) {
            res.send(await journal.deleteSubgroup(id));
        } else {
            res.send('not enough id parameter');
        }
    });

// USER
    router.get('/addUser', async function(req, res) {
        var role = req.query.role;
        var name = req.query.name;
        var login = req.query.login;
        var password = req.query.password;
        var token = req.query.token;
        if (role && name && login && password) {
            const result = await journal.addUser(role, name, login, password);
            res.send((result) ? result : 'Вероятно, такая запись уже существует. Проверьте вводимые данные.');
        } else {
            res.send('not enough parameters');
        }
    });
    
    router.get('/listOfUsers', async function(req, res) {
        res.send(await journal.listOfUsers());
    });
  
    router.get('/deleteUser/:id', async function(req, res) {
        var id = req.params.id - 0;
        if (!isNaN(id)) {
            res.send(await journal.deleteUser(id));
        } else {
            res.send('not enough id parameter');
        }
    });
  
// SCHEDULE
    router.get('/addSchedule', async function(req, res) {
        var time = req.query.time;
        var day = req.query.day;
        var lesson_id = req.query.lesson_id - 0;
        var subgroup_id = req.query.subgroup_id - 0;
        if (!isNaN(time) && day && !isNaN(lesson_id) && !isNaN(subgroup_id)) {
            const result = await journal.addSchedule(time, day, lesson_id, subgroup_id);
            res.send((result) ? result : 'Вероятно, такая запись уже существует. Проверьте вводимые данные.');
        } else {
            res.send('not enough parameters');
        }
    });

    router.get('/listOfSchedules', async function(req, res) {
        res.send(await journal.listOfSchedules());
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
    router.get('/noteStudents', async function(req, res) {
        var noteList = req.query.noteList;
        var scheduleId = req.query.scheduleId;
        if (noteList && scheduleId) {
            const result = await journal.noteStudents(noteList, scheduleId);
            res.send((result) ? result : 'Вероятно, такая запись уже существует. Проверьте вводимые данные.');
        } else {
            res.send('not enough parameters');
        }
    });

    router.get('/uploadData', async function(req, res) {
        var startDate = req.query.startDate;
        var finishDate = req.query.finishDate;
        if (startDate && finishDate && (startDate <= finishDate)) {
            const result = await journal.uploadData(startDate, finishDate);
            res.send((result) ? result : 'Вероятно, произошла ошибка. Проверьте вводимые данные.');
        } else  if (startDate && !finishDate) {
            var date = new Date();
            var values = [ date.getDate(), date.getMonth() + 1 ];
            for( var id in values ) {
                values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
            }
            finishDate = date.getFullYear() + '-' + values[ 1 ] + '-' + values[ 0 ];
            const result = journal.uploadData(startDate, finishDate);
            res.send((result) ? result : 'Вероятно, произошла ошибка. Проверьте вводимые данные.');
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