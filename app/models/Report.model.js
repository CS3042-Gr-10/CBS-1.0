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
                return (false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
                return (rows[0]);
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
                return (false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
                return (rows[0]);
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
                return (false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
                return (rows[0]);
            }
        });
    });
}

function getAllLoanPayments(dates) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from transaction where state = "LOAN" and date between ? and ?',dates, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
                return (false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
                return (rows[0]);
            }
        });
    });
}

function getUnpaidLoan() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from loan_detail where state = "NOT-PAID"',dates, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
                return (false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
                return (rows[0]);
            }
        });
    });
}
