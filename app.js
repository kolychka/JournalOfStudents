const express = require('express');
const app = express();
const http = require('http').Server(app);

const DB = require('./application/modules/db/db');
const Journal = require('./application/modules/journal/journal');
const User = require('./application/modules/user/user');
const Logic = require('./application/modules/logic/logic');
const Router = require('./application/router/router');

const db = new DB();
const journal = new Journal({ db });
const user = new User({ db });
const logic = new Logic({ user });
const router = new Router({ journal, user, logic });

app.use(express.static(__dirname + '/public'));
app.use(router); // use remote router

http.listen(3000, function() {
  console.log('server start at port 3000');
});