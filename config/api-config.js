const express = require("express");
const app = express();
const path = require('path');
const mysql = require('mysql');
const db = require('./database');
const http = require('http');
const AuthenticRoute = require('../app/routes/authentic.route');
const BankManagerRoute = require('../app/routes/BankManager.route');
const CustomerRoute = require('../app/routes/Customer.route');
const EmployeeRoute = require('../app/routes/Employee.route');
const ErrorRoute = require('../app/routes/error.route');
const errorCode = require('../common/error-code');
const errorMessage = require('../common/error-methods');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const MySQLDBStore = require('express-mysql-session')(session);
const hbs = require('express-handlebars')

const sessionStore = new MySQLDBStore({
    createDatabaseTable: false,
    endConnectionOnClose: false
},db)

app.set('views', path.join(appRoot,'app/views'))

app.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout: 'index',
    layoutsDir:path.join(appRoot,'app/views/layouts'),
    partialsDir:path.join(appRoot,'app/views/partials'),

}));

app.set('view engine', "hbs");
// var schedule = require('node-schedule');
 
// var j = schedule.scheduleJob('*/1 * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });

dbfunc.connectionCheck.then((data) =>{
    console.log("DB has connected!!");
 }).catch((err) => {
     console.log(err);
 });
 
 app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}));

const router = express.Router();
//app.use('/api',router);


//const secureApi = express.Router();

//set static folder
app.use(express.urlencoded({
    extended:true
}));

console.log(path.join(appRoot, 'public'));
app.use(express.static(path.join(appRoot, 'public')));

//body parser middleware

//app.use('/secureApi',secureApi);
//secureApi.use(checkToken);


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/',router);


// index route
app.get('/', (req,res) => {
    res.render('login');
});

AuthenticRoute.init(router);
EmployeeRoute.init(router);
//UserRoute.init(router);
//BankManagerRoute.init(router);
//CustomerRoute.init(router);
//ErrorRoute.init(router);
//BankManagerRoute.init(secureApi);

const ApiConfig = {
    app: app
};

module.exports = ApiConfig;
