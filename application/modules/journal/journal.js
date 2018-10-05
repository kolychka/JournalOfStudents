function Journal(options) {

    var db = options.db;

// STUDENT  
    this.addStudent = async (name, surname, lastname, record_book, status) => {
        var result = await db.addStudent(name, surname, lastname, record_book, status);
        if (result) {
            return await db.getStudentByName(name, record_book);
        } else {
            return null;
        }
    };
  
    this.updateStudent = async (id, params) => {
        var result = await db.updateStudent(id, params);
        if (result) {
            return await db.getStudentById(id);
        } else {
            return null;
        }
    };

    this.listOfStudents = () => {
        return db.getListOfStudents();
    };

    this.deleteStudent = (id) => {
        return db.deleteStudent(id);
    };

// LESSON
    this.addLesson = async (name) => {
        var result = await db.addLesson(name);
        if (result) {
            return await db.getLessonByName(name);
        } else {
            return null;
        }
    };
  
    this.updateLesson = async (id, name) => {
        var result = await db.updateLesson(id, name);
        if (result) {
            return await db.getLessonById(id);
        } else {
            return null;
        }
    };

    this.listOfLessons = () => {
        return db.getListOfLessons();
    };

    this.deleteLesson = (id) => {
        return db.deleteLesson(id);
    };

// SUBGROUP 
    this.addSubgroup = async (name, description, group_code) => {
        var result = await db.addSubgroup(name, description, group_code);
        if (result) {
            return await db.getSubgroupByName(name, description, group_code);
        } else {
            return null;
        }
    };
  
    this.updateSubgroup = async (id, params) => {
        var result = await db.updateSubgroup(id, params);
        if (result) {
            return await db.getSubgroupById(id);
        } else {
            return null;
        }
    };

    this.listOfSubgroups = () => {
        return db.getListOfSubgroups();
    };

    this.deleteSubgroup = (id) => {
        return db.deleteSubgroup(id);
    };

// USER
    this.addUser = async (role, name, login, password) => {
        var result = await db.addUser(role, name, login, password);
        if (result) {
            return await db.getUserByName(role, name);
        } else {
            return null;
        }
    };
  
    this.updateUser = async (id, params) => {
        var result = await db.updateUser(id, params);
        if (result) {
            return await db.getUserById(id);
        } else {
            return null;
        }
    };

    this.listOfUsers = () => {
        return db.getListOfUsers();
    };

    this.deleteUser = (id) => {
        return db.deleteUser(id);
    };

// SCHEDULE
    this.addSchedule = async (time, day, lesson_id, subgroup_id) => {
        var result = await db.addSchedule(time, day, lesson_id, subgroup_id);
        if (result) {
            return await db.getSchedule(time, day, lesson_id, subgroup_id);
        } else {
            return null;
        }
    };

    this.updateSchedule = async (id, time, day, lesson_id, subgroup_id) => {
        var result = await db.updateSchedule(id, time, day, lesson_id, subgroup_id);
        if (result) {
            return await db.getSchedule(time, day, lesson_id, subgroup_id);
        } else {
            return null;
        }
    };

    this.listOfSchedules = () => {
        return db.getListOfSchedules();
    };

    this.deleteSchedule = (id) => {
        return db.deleteSchedule(id);
    };

// OTHERS    
    this.noteStudents = (noteList, schedule_id) => {
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

    this.uploadData = (startDate, finishDate) => {
        return db.getUploadData(startDate, finishDate);
    };
}

module.exports = Journal;