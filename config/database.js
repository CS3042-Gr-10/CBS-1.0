const mysql = require('mysql');
const fs = require('fs');


module.exports = mysql.createPool({
    user: 'u05dacvdhduk0jzi',
    host: 'bpi9zrldmffepsxk5zeg-mysql.services.clever-cloud.com',
    database: 'bpi9zrldmffepsxk5zeg',
    port: 3306,
    password: 'GRWM2e4bac8RVsmQIfHo',
    connectionLimit:20
})





