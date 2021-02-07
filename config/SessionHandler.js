const db = require('./database');
const session = require('express-session');
const MySQLDBStore = require('express-mysql-session')(session);

const sessionStore = new MySQLDBStore(
  {
    createDatabaseTable: true,
    clearExpired:false,
    endConnectionOnClose: false,
  }, db);

const session_object = session({
  name:SESS_NAME,
  secret: SECRET,
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