function Logic(options) {

    options = (options instanceof Object) ? options : {};
    const user = options.user;

    let users = {};
    let methods = { //не полный список
        login: '/login/:login/:hash/:rnd',
        logout: '/logout/:token',
        addUser: '/addUser/:role/:name/:login/:password',
        updateUser: '/updateUser/:token',
        updateUserPassword: '/updateUserPassword/:id/:password',
        listOfUsers: '/listOfUsers',
        deleteUser: '/deleteUser/:id'
    };

    this.login = async ({ login, hash, rnd }) => {
        const result = await user.login(login, hash, rnd);
        if (result && result.id) {
            users['id'] = result;
            return result;
        }
        return null;
    };

    this.logout = async ({ token }) => {
        const result = await user.logout(token);
        return result ? result : null;
    };

}

module.exports = Logic;