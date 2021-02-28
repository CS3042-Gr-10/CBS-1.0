const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

ReportModel = {
    getAllDeposits,
    getAllWithdraws,
    getAllTransfers,
    getAllLoanPayments,
    getUnpaidLoan
}

function getAllDeposits(dates) {
    // dates = [start_date, end_date]
    return new Promise((resolve, reject) => {
        db.query('SELECT * from transaction natural join deposit where date between ? and ?',dates, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getAllWithdraws(dates) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from transaction natural join withdraw where date between ? and ?',dates, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getAllTransfers(dates) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from transaction natural join transfer where date between ? and ?',dates, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getAllLoanPayments(dates) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from transaction natural join loan_payment where trans_type = "LOAN" and date between ? and ?',dates, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getUnpaidLoan() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from loan_detail where loan_state = "NOT-PAID"', (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getWithdrawByAccId(id,limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from withdraw natural join transaction where acc_id = ? limit ?', (id, limit),(error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getDepositByAccId(id,limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from deposit natural join transaction where acc_id = ? limit ?', (id, limit),(error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

function getTransferByAccId(id,limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from transfer natural join transaction where acc_id = ? limit ?', (id, limit),(error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
            }
        });
    });
}

module.exports = ReportModel;