
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const FDModel = {
    addCFixedDeposit
}

function addCFixedDeposit(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_fd_acc.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_fd_acc(?,?,?,?,?,?)`, acc, (error, rows, fields) => {

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

module.exports = FDModel;