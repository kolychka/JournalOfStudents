function Journal(options) {

    const db = options.db;

// STUDENT  
    this.addStudent = async ({name, surname, lastname, record_book, status}) => {
        const result = await db.addStudent(name, surname, lastname, record_book, status);
        return result ? await db.getStudentByName(name, record_book) : null;
    };
  
    this.updateStudent = async (id, params) => {
        const result = await db.updateStudent(id, params);
        return result ? await db.getStudentById(id) : null;
    };

    this.listOfStudents = () => {
        return db.getListOfStudents();
    };

    this.deleteStudent = ({id}) => {
        console.log(id, "journal");
        return db.deleteStudent(id);
    };

// LESSON
    this.addLesson = async ({name_lesson}) => {
        const result = await db.addLesson(name_lesson);
        return result ? await db.getLessonByName(name_lesson) : null;
    };
  
    this.updateLesson = async (id, name_lesson) => {
        const result = await db.updateLesson(id, name_lesson);
        return result ? await db.getLessonById(id) : null;
    };

    this.listOfLessons = () => {
        return db.getListOfLessons();
    };

    this.deleteLesson = ({id}) => {
        return db.deleteLesson(id);
    };

// SUBGROUP 
    this.addSubgroup = async ({name_subgroup, description, group_code}) => {
        const result = await db.addSubgroup(name_subgroup, description, group_code);
        return result ? await db.getSubgroupByName(name_subgroup, description, group_code) : null;
    };
  
    this.updateSubgroup = async (id, params) => {
        const result = await db.updateSubgroup(id, params);
        return result ? await db.getSubgroupById(id) : null;
    };

    this.listOfSubgroups = () => {
        return db.getListOfSubgroups();
    };

    this.deleteSubgroup = ({id}) => {
        return db.deleteSubgroup(id);
    };

// SCHEDULE
    this.addSchedule = async ({time, day, lesson_id, subgroup_id}) => {
        const result = await db.addSchedule(time, day, lesson_id, subgroup_id);
        return result ? await db.getSchedule(time, day, lesson_id, subgroup_id) : null;
    };

    this.updateSchedule = async (id, time, day, lesson_id, subgroup_id) => {
        const result = await db.updateSchedule(id, time, day, lesson_id, subgroup_id);
        return result ? await db.getSchedule(time, day, lesson_id, subgroup_id) : null;
    };

    this.listOfSchedules = () => {
        return db.getListOfSchedules();
    };

    this.deleteSchedule = ({id}) => {
        return db.deleteSchedule(id);
    };

// OTHERS    
    this.noteStudents = (noteList, schedule_id) => {
        let arr = noteList.split(';');
        const res = [];
        if (arr instanceof Array) {
            for (let i = 0; i < arr.length; i++) {
                let arr2 = arr[i].split(',');
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