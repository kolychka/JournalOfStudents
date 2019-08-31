function Logic(options) {

    options = (options instanceof Object) ? options : {};
    const user = options.user;

    let users = {};

    const PERMISSION = {
        1: { // деканат
            logout: 'logout',
            addUser: 'addUser',
            listOfUsers: 'listOfUsers',
            updateUser: 'updateUser',
            updateUserPassword: 'updateUserPassword',
            deleteUser: 'deleteUser',
            uploadData: 'uploadData',
            listOfStudents: 'listOfStudents',
            listOfSubgroups: 'listOfSubgroups'
        },
        2: { // старосты
            logout: 'logout',
            updateUser: 'updateUser',
            addStudent: 'addStudent',
            addLesson: 'addLesson',
            addSchedule: 'addSchedule', 
            addSubgroup: 'addSubgroup',
            deleteLesson: 'deleteLesson',
            deleteSchedule: 'deleteSchedule',
            deleteStudent: 'deleteStudent',
            deleteSubgroup: 'deleteSubgroup',
            listOfLessons: 'listOfLessons',
            listOfSchedules: 'listOfSchedules',
            listOfStudents: 'listOfStudents',
            listOfSubgroups: 'listOfSubgroups',
            updateLesson: 'updateLesson',
            updateSchedule: 'updateSchedule',
            updateStudent: 'updateStudent',
            updateSubgroup: 'updateSubgroup',
            noteStudents: 'noteStudents'
        }
    }

    this.login = async ({ login, hash, rnd }) => {
        const result = await user.login(login, hash, rnd);
        if (result && result.id) {
            users[result.id] = result;
            return result;
        }
        return null;
    };

    this.logout = async ({ token }) => {
        const result = await user.logout(token);
        return result ? result : null;
    };

    this.checkPermisson = async (method, token) => {
        if (method === 'login') {
            return true;
        }
        const userRole = await user.getUserByToken(token); // взять юзера по токену
        if (userRole) {
            const role = userRole.role; // взять роль юзера
            if (role && method) {
                return !!PERMISSION[role][method]; // проверить, что у этой роли есть такой метод в разрешениях
            }
        }
        return false;
    };

}

module.exports = Logic;