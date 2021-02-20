const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const LoanModel = {
    addStdLoan,
    addOnlineLoan,
    addMonthlyPay,
    acceptStdLoan
    addMonthlyPay,
    getLoanForApproval,
    getLoanDetails,
}

function addStdLoan(loan) {

    //TODO: set "loan" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_std_loan.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_std_loan(?,?,?,?)`, loan, (error, rows, fields) => {

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
        db.query(`CALL add_online_loan(?,?,?,?)`, acc, (error, rows, fields) => {

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

function acceptStdLoan(loan) {

    //TODO: set "loan" attribute appropriate to the data passing -- checkout ../document/sql_scripts/update_loan_st.sql
    return new Promise((resolve, reject) => {
        db.query(`CALL update_loan_st(?)`, loan, (error, rows, fields) => {

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

function getLoanForApproval(branch_id){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM loan NATURAL JOIN standard_loan WHERE state="PENDING" AND branch_id =? order by loan_id DESC limit 10  `, branch_id ,(error, rows, fields) => {

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

function getLoanDetails(loan_id){
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM loan NATURAL JOIN standard_loan WHERE loan_id=? `, loan_id ,(error, rows, fields) => {

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



module.exports = LoanModel;