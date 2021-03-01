
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const FDModel = {
    addCFixedDeposit,
    getFDByUserID,
    getFDDetailsByID
}

function addCFixedDeposit(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_fd_acc.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_fd_acc(?,?,?,?,?)`, acc, (error, rows, fields) => {

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

function getFDByUserID(id){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM fixed_deposit WHERE customer_id=? `, id ,(error, rows, fields) => {

            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows[0]);
            }
        });
    });
}

function getFDDetailsByID(id){
    //TODO: set "id" attribute appropriate to the data passing -- checkout ../document/sql_scripts/get_fd_details.sql
    return new Promise((resolve, reject) => {
        db.query(`call get_fd_details(?)`, id ,(error, rows, fields) => {

            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows[0]);
            }
        });
    });
}


module.exports = FDModel;