const express = require("express");
const app = express();
const path = require('path');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const db = require('./database');
const dbfunc = require('./db-function');
const http = require('http');
const bodyParser = require('body-parser');
const UserRoute = require('../app/routes/user.route');
const AuthenticRoute = require('../app/routes/authentic.route');
const BankManagerRoute = require('../app/routes/BankManager.route');
const CustomerRoute = require('../app/routes/Customer.route');
const EmployeeRoute = require('../app/routes/Employee.route');
const errorCode = require('../common/error-code');
const errorMessage = require('../common/error-methods');
const checkToken = require('./secureRoute');

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

app.use(bodyParser.json());

var router = express.Router();
app.use('/api',router);
AuthenticRoute.init(router);

var secureApi = express.Router();

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware

app.use('/secureApi',secureApi);
//secureApi.use(checkToken);


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// index route
app.get('/', (req,res) => {
    res.send('hello world');
});

//Login Page
app.get('/login',(req,res)=>{
    res.send('<h2>Login Page</h2>')
});

//Sign up
app.get('/signup',(req,res)=>{
    res.send('<h2>Sign Page</h2>')
});

UserRoute.init(secureApi);
//BankManagerRoute.init(secureApi);

var ApiConfig = {
    app: app
}

module.exports = ApiConfig;
