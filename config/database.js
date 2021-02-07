const mysql = require('mysql');
const fs = require('fs');


module.exports = mysql.createPool({
    user: 'dev',
    host: '34.101.117.36',
    database: 'main_db',
    port: 3306,
    password: 'NDUCI@cse3042',
})





