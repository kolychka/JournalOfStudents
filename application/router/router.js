'use strict';

//почитать про деструктуризацию объектов

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
/*+*/ // -- означает, что метод проверен и работает
    // const obj1 = {
    //     a: 7, b: 2
    // };
    // const obj2 = {
    //     c: 5, d: function () {}
    // }; /*+*/

    // const obj3 = { ...obj1, ...obj2 };
    // console.log(obj3);

/*+*/    router.get('/addStudent/:name/:record_book', async (req, res) => {
        const par = { ...req.params, ...req.query };
        if (verification.check(par, [PARAM.NAME, PARAM.RECORD_BOOK])) {
            const result = await journal.addStudent(par);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002)); // идёт сюда
        }
    });

/*+*/    router.get('/updateStudent', async (req, res) => { 
        let params = { id: req.query.id, name: req.query.name, surname: req.query.surname, lastname: req.query.lastname, 
                       record_book: req.query.record_book, status: req.query.status };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){
            delete params[params.id];
            const result = await journal.updateStudent(req.query.id, params);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });

/*+*/    router.get('/listOfStudents', async (req, res) => {
        res.send(await journal.listOfStudents());
    });

/*+*/    router.get('/deleteStudent/:id', async (req, res) => {
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await journal.deleteStudent(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });

// LESSON   
/*+*/    router.get('/addLesson/:name_lesson', async (req, res) => {
        const par = { ...req.params, ...req.query };
        if (verification.check(par, [PARAM.NAME_LESSON])) {
            const result = await journal.addLesson(par);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });
    
/*+*/    router.get('/updateLesson/:id/:name_lesson', async (req, res) => { 
        if (verification.check(req.params, [PARAM.ID, PARAM.NAME_LESSON])) { 
            const result = await journal.updateLesson(req.params.id, req.params.name_lesson);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });

/*+*/    router.get('/listOfLessons', async (req, res) => {
        res.send(await journal.listOfLessons());
    });

/*+*/    router.get('/deleteLesson/:id', async (req, res) => {
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await journal.deleteLesson(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });

// SUBGROUP   
/*+*/    router.get('/addSubgroup/:name_subgroup', async (req, res) => {
        const par = { ...req.params, ...req.query };
        if (verification.check(par, [PARAM.NAME_SUBGROUP, PARAM.DESCRIPTION, PARAM.GROUP_CODE])) {
            const result = await journal.addSubgroup(par);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });
 
    router.get('/updateSubgroup', async (req, res) => { 
        let params = { id: req.query.id, name: req.query.name, description: req.query.description, group_code: req.query.group_code };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){
            delete params[params.id];
            const result = await journal.updateSubgroup(req.query.id, params);
            res.send((result) ? result : errors.get(2001));             
        } else { 
            res.send(errors.get(2002)); 
        } 
    });
  
/*+*/    router.get('/listOfSubgroups', async (req, res) => {
        res.send(await journal.listOfSubgroups());
    });
    
/*+*/    router.get('/deleteSubgroup/:id', async (req, res) => { 
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await journal.deleteSubgroup(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });

// USER   
    router.get('/login/:login/:hash/:rnd', async (req, res) => {
        if (verification.check(req.params, [PARAM.LOGIN, PARAM.HASH, PARAM.RND])) {
            const result = await user.login(req.params);
            res.send((result) ? result : errors.get(2003));
        } else {
            res.send(errors.get(2002));
        }
    });
    
    router.get('/logout/:token', async (req, res) => {
        if (verification.check(req.params, [PARAM.TOKEN])) {
            const result = await user.logout(req.params);
            res.send((result) ? result : errors.get(2006));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/addUser/:role/:name/:login/:password', async (req, res) => {
        const par = { ...req.params, ...req.query };
        if (verification.check(par, [PARAM.ROLE, PARAM.NAME, PARAM.LOGIN, PARAM.PASSWORD])) {
            const result = await user.addUser(par);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/updateUser', async (req, res) => { 
        let params = { token: req.query.token, role: req.query.role, 
                       name: req.query.name,  login: req.query.login, password: req.query.password };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){ 
            delete params[params.token];
            const result = await user.updateUser(req.query.token, params);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });

    router.get('/updateUserPassword/:id/:password', async (req, res) => { 
        if (verification.check(req.params, [PARAM.ID, PARAM.PASSWORD])) { 
            const result = await user.updateUserPassword(req.params.id, req.params.password);
            res.send((result) ? result : errors.get(2001)); 
        } else { 
            res.send(errors.get(2002)); 
        } 
    });
    
    router.get('/listOfUsers', async (req, res) => { // небезопасный, убрать пароли, токены, логины
        res.send(await user.listOfUsers());
    });
  
    router.get('/deleteUser/:id', async (req, res) => {
        if (verification.check(req.params, [PARAM.ID])) {
            res.send(await user.deleteUser(req.params));
        } else {
            res.send(errors.get(2002));
        }
    });
  
// SCHEDULE
/*+*/    router.get('/addSchedule/:time/:day/:lesson_id/:subgroup_id', async (req, res) => {
        const par = { ...req.params, ...req.query };
        if (verification.check(par, [PARAM.TIME, PARAM.DAY, PARAM.LESSON_ID, PARAM.SUBGROUP_ID])) {
            const result = await journal.addSchedule(par);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/updateSchedule', async (req, res) => {
        let params = { id: req.query.id, time: req.query.time, day: req.query.day, 
                       lesson_id: req.query.lesson_id, subgroup_id: req.query.subgroup_id };
        const keys = [];
        for (let key in params) {
            !params[key] ? delete params[key] : keys.push(key);
        }
        if (verification.check(params, keys)){ 
            delete params[params.id];
            const result = await journal.updateSchedule(req.query.id, params);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

/*+*/    router.get('/listOfSchedules', async (req, res) => {
        res.send(await journal.listOfSchedules());
    });
   
/*+*/    router.get('/deleteSchedule/:id', (req, res) => {
        const obj3 = {};
        console.log(obj3);
        if (verification.check(req.params, [PARAM.ID])) {
            journal.deleteSchedule(req.params).then((result) => res.send(result));
        } else {
            res.send(errors.get(2002));
        }
    });
 
// OTHERS    
    router.get('/noteStudents', async (req, res) => {
        if (verification.check(req.query, [PARAM.NOTE_LIST, PARAM.SCHEDULE_ID])) {
            const result = await journal.noteStudents(req.query);
            res.send((result) ? result : errors.get(2001));
        } else {
            res.send(errors.get(2002));
        }
    });

    router.get('/uploadData', async (req, res) => {
        if (verification.check(req.query, [PARAM.START_DATE, PARAM.FINISH_DATE])) {
            const result = await journal.uploadData(req.query);
            res.send((result) ? result : errors.get(2004));
        } else  if (startDate && !finishDate) {
            const date = new Date();
            let values = [ date.getDate(), date.getMonth() + 1 ];
            for( let id in values ) {
                values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
            }
            finishDate = date.getFullYear() + '-' + values[ 1 ] + '-' + values[ 0 ];
            const result = journal.uploadData(PARAM.START_DATE, finishDate);
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