var express = require('express');
var app = express();
var http = require('http').Server(app);

var DB = require('./application/modules/db/db');
var Journal = require('./application/modules/journal/journal');
var Router = require('./application/router/router');

var db = new DB();
var journal = new Journal({ db: db });
var router = new Router({ journal: journal});

app.use(express.static(__dirname + '/public'));
app.use(router); // use remote router

http.listen(3000, function() {
  console.log('server start at port 3000');
});