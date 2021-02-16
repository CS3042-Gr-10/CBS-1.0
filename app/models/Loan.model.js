const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const LoanModel = {
    addStdLoan
}

function addStdLoan(loan) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_std_loan.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_std_loan(?,?,?,?,?)`, acc, (error, rows, fields) => {

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

module.exports = LoanModel;