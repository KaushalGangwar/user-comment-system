const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const MongoClient			= require('mongodb').MongoClient;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

const http = require('http');
function startInitialProcess() {
    db = '';
    console.log("Creating Mongo connection");
    MongoClient.connect("mongodb://localhost:27017", function (err, database) {
        if (err) {
            console.log("Failed to connect to tookan mongo");
            return;
        }
        db = database.db('user-comment-system');
    });
}
http.createServer(app).listen(8080,(error, result) => {
    console.log("Express server listening at 8080");
    startInitialProcess();



})
module.exports = app;
