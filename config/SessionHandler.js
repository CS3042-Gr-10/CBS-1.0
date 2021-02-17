const db = require('./database');
const session = require('express-session');
const MySQLDBStore = require('express-mysql-session')(session);

/*
const sessionStore = new MySQLDBStore(
  {
    user: 'dev',
    host: '34.101.117.36',
    database: 'main_db',
    port: 3306,
    password: 'NDUCI@cse3042',
    createDatabaseTable: true,
    clearExpired:false,
    endConnectionOnClose: false,
  });
*/
const sessionStore = new MySQLDBStore(
  {
    createDatabaseTable: true,
    clearExpired:false,
    endConnectionOnClose: false,
  } ,db);

const session_object = session({
  name:SESS_NAME,
  secret: SECRET,
  store:sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    SameSite:false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: IN_PROD
  }
});

module.exports = {
  sessionStore:sessionStore,
  session_object:session_object
}