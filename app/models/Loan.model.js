const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const LoanModel = {
    addStdLoan,
    addOnlineLoan,
    addMonthlyPay
}

function addStdLoan(loan) {

    //TODO: set "loan" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_std_loan.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_std_loan(?,?,?,?,?)`, loan, (error, rows, fields) => {

            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {

                dbFunc.connectionRelease;
                // console.log(rows);
                resolve(rows);
            }
        });
    });
}

function addOnlineLoan(loan) {

    //TODO: set "loan" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_online_loan.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_online_loan(?,?,?,?,?)`, acc, (error, rows, fields) => {

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

function addMonthlyPay(payment) {

    //TODO: set "payment" attribute appropriate to the data passing -- checkout ../document/sql_scripts/loan_payment.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL loan_payment(?)`, payment, (error, rows, fields) => {

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