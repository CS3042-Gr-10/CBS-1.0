
const db = require('../config/database');
var dbFunc = require('../config/db-function');

function addCFixedDeposit(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_fd.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_fd(?,?,?,?,?,?)`, acc, (error, rows, fields) => {

            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}