const md5 = require('md5');

function User(options) {

    options = (options instanceof Object) ? options : {};
    const db = options.db;

    function checkPassword({ _hash, user, rnd }) {
        const hashS = md5(user.password + rnd); // 2. восстановить хеш по rnd
        return !!(_hash === hashS);
    };

    async function checkToken(token) {
        return await db.getUserByToken(token);
    };

    this.login = async ({ login, hash, rnd }) => {
        const user = await db.getUser(login); // 1. взять юзера по логину
        const _hash = md5(hash + rnd); // 3. сравнить хеши
        if (user) {
            if (checkPassword({ _hash, user, rnd })) { // 4. если всё хорошо, сгенерировать токен
                const token = md5(_hash + Math.random() * 1000000);
                await db.updateUserToken(user.id, token); 
                return { token, name: user.name };
            }
        }
        return null;
    };

    this.logout = async ({ token }) => {
        const user = await checkToken(token);
        if (user) {
            await db.updateUserToken(user.id, '');
            return true;
        }
        return null;
    };

    this.addUser = async ({role, name, login, password}) => {
        let hashPassword;
        if (role && name && login && password) {
            hashPassword = md5(login + password);
        }     
        const result = await db.addUser(role, name, login, hashPassword);
        return (result) ? db.getUser(login) : null;
    };

    this.listOfUsers = () => {
        return db.getListOfUsers();
    };

    this.deleteUser = (id) => {
        return db.deleteUser(id);
    };

    this.updateUser = async (token, params) => {
        const result = await db.updateUser(token, params);
        return (result) ? await db.getUserByToken(token) : null;
    };

    this.updateUserPassword = async (id, password) => {
        const result = await db.updateUserPassword(id, password);
        return (result) ? await db.getUserById(id) : null;
    };

}

module.exports = User;