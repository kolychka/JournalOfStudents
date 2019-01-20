'use strict';

//почитать про деструктуризацию объектов
// сделать add и прочее по примеру addStudent
const express = require('express');
const md5 = require('md5');
const Verification = require('../modules/verification/verification');
const Errors = require('./errors');

function Router(options) {
    const router = express.Router();
    const user = options.user;
    const journal = options.journal;
    const verification = new Verification();
    const PARAM = verification.getParamNames();
    const errors = new Errors();

// STUDENT  
    router.get('/addStudent/:name/:record_book', async (req, res) => {
        // на вход ожидаются параметры: name (обязательный), record_book (обязательный), surname, lastname, status
        const { surname, lastname, status } = req.query;
        let params = { ...req.params, surname, lastname, status };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)) {
            const result = await journal.addStudent(params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002)); 
        }
    });

    router.get('/updateStudent/:id', async (req, res) => { 
        // на вход ожидаются параметры: id (обязательный), name, record_book, surname, lastname, status
        const { name, surname, lastname, status, record_book } = req.query;
        let params = { ...req.params, name, surname, lastname, status, record_book };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){
            delete params['id'];
            const result = await journal.updateStudent(req.params.id, params);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });

    router.get('/listOfStudents', async (req, res) => {
        // не ожидается параметров на вход
        res.send(await journal.listOfStudents());
    });

    router.get('/deleteStudent/:id', async (req, res) => {
        // на вход ожидается параметр: id (обязательный)
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await journal.deleteStudent(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });

// LESSON   
    router.get('/addLesson/:name_lesson', async (req, res) => {
        // на вход ожидается параметр: name_lesson (обязательный)
        if (verification.check(req.params, [PARAM.NAME_LESSON])) {
            const result = await journal.addLesson(req.params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });
    
    router.get('/updateLesson/:id/:name_lesson', async (req, res) => { 
        // на вход ожидаются параметры: name_lesson (обязательный), id (обязательный)
        if (verification.check(req.params, [PARAM.ID, PARAM.NAME_LESSON])) { 
            const result = await journal.updateLesson(req.params.id, req.params.name_lesson);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });

    router.get('/listOfLessons', async (req, res) => {
        // не ожидается параметров на вход
        res.send(await journal.listOfLessons());
    });

    router.get('/deleteLesson/:id', async (req, res) => {
        // на вход ожидается параметр: id (обязательный)
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await journal.deleteLesson(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });

// SUBGROUP   
    router.get('/addSubgroup/:name_subgroup', async (req, res) => {
        // на вход ожидаются параметры: name_subgroup (обязательный), user_id, description, group_code
        const { description, user_id, group_code } = req.query;
        let params = { ...req.params, description, user_id, group_code };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)) {
            const result = await journal.addSubgroup(params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });
 
    router.get('/updateSubgroup/:id', async (req, res) => { 
        // на вход ожидаются параметры: id (обязательный), user_id, name, description, group_code
        const { name, user_id, description, group_code } = req.query;
        let params = { ...req.params, name, user_id, description, group_code };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){
            delete params['id'];
            const result = await journal.updateSubgroup(req.params.id, params);
            res.send((result) ? result : errors.get(2001));             
        } else { 
            res.send(errors.get(2002)); 
        } 
    });
  
    router.get('/listOfSubgroups', async (req, res) => {
        // не ожидается параметров на вход
        res.send(await journal.listOfSubgroups());
    });
    
    router.get('/deleteSubgroup/:id', async (req, res) => { 
        // на вход ожидается параметр: id (обязательный)
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await journal.deleteSubgroup(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });

// USER   
    router.get('/login/:login/:hash/:rnd', async (req, res) => {
        // на вход ожидаются параметры: login (обязательный), hash (обязательный), rnd (обязательный)
        if (verification.check(req.params, [PARAM.LOGIN, PARAM.HASH, PARAM.RND])) {
            const result = await user.login(req.params);
            res.send((result) ? result : errors.get(2003));
        } else {
            res.send(errors.get(2002));
        }
    });
    
    router.get('/logout/:token', async (req, res) => {
        // на вход ожидается параметр: token (обязательный)
        if (verification.check(req.params, [PARAM.TOKEN])) {
            const result = await user.logout(req.params);
            res.send((result) ? result : errors.get(2006));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/addUser/:role/:name/:login/:password', async (req, res) => {
        // на вход ожидаются параметры: role (обязательный), name (обязательный), login (обязательный), password (обязательный)
        if (verification.check(req.params, [PARAM.ROLE, PARAM.NAME, PARAM.LOGIN, PARAM.PASSWORD])) {
            const result = await user.addUser(req.params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/updateUser/:token', async (req, res) => { 
        // на вход ожидаются параметры: id (обязательный), token (обязательный), role, name, login, password
        const { role, name, login, password } = req.query;
        let params = { ...req.params, role, name, login, password }; 
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){ 
            delete params['id'];
            const result = await user.updateUser(req.params.token, params);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });

    router.get('/updateUserPassword/:id/:password', async (req, res) => { 
        // на вход ожидаются параметры: id (обязательный), password (обязательный)
        if (verification.check(req.params, [PARAM.ID, PARAM.PASSWORD])) { 
            const result = await user.updateUserPassword(req.params.id, req.params.password);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });
    
    router.get('/listOfUsers', async (req, res) => { // небезопасный, убрать пароли, токены, логины
        // не ожидается параметров на вход
        res.send(await user.listOfUsers());
    });
  
    router.get('/deleteUser/:id', async (req, res) => {
        // на вход ожидается параметр: id (обязательный)
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await user.deleteUser(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });
  
// SCHEDULE
    router.get('/addSchedule/:time/:day/:lesson_id/:subgroup_id', async (req, res) => {
        // на вход ожидаются параметры: time (обязательный), day (обязательный), lesson_id (обязательный), subgroup_id (обязательный)
        if (verification.check(req.params, [PARAM.TIME, PARAM.DAY, PARAM.LESSON_ID, PARAM.SUBGROUP_ID])) {
            const result = await journal.addSchedule(req.params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/updateSchedule/:id', async (req, res) => {
        // на вход ожидаются параметры: id (обязательный), day, lesson_id, subgroup_id
        const { day, lesson_id, subgroup_id } = req.query;
        let params = { ...req.params, day, lesson_id, subgroup_id };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){ 
            delete params['id'];
            const result = await journal.updateSchedule(req.params.id, params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/listOfSchedules', async (req, res) => {
        // не ожидается параметров на вход
        res.send(await journal.listOfSchedules());
    });
   
    router.get('/deleteSchedule/:id', (req, res) => {
        // на вход ожидается параметр: id (обязательный)
        if (verification.check(req.params, [PARAM.ID])) {
            journal.deleteSchedule(req.params).then((result) => res.send(result));
        } else {
            res.send(errors.get(2002));
        }
    });
 
// OTHERS    
    router.get('/noteStudents/:note_list/:schedule_id', async (req, res) => {
        // на вход ожидаются параметры: note_list (обязательный), schedule_id (обязательный)
        if (verification.check(req.params, [PARAM.NOTE_LIST, PARAM.SCHEDULE_ID])) {
            const result = await journal.noteStudents(req.params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/uploadData/:start_date', async (req, res) => {
        // на вход ожидаются параметры: start_date (обязательный), finishDate
        if (verification.check(req.params, [PARAM.START_DATE, PARAM.FINISH_DATE])) {
            const result = await journal.uploadData(req.params);
            res.send((result) ? result : errors.get(2004));
        } else if (verification.check(req.params, [PARAM.START_DATE])) {
            const date = new Date();
            let values = [ date.getDate(), date.getMonth() + 1 ];
            for (let id in values) {
                values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
            }
            let finish_date = date.getFullYear() + '-' + values[ 1 ] + '-' + values[ 0 ];
            const params = { ...req.params, finish_date };
            const result = await journal.uploadData(params);
            res.send((result) ? result : errors.get(2004));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.all('/*', (req, res) => {
        res.send(errors.get(2005));
    });

    return router;
}

module.exports = Router;