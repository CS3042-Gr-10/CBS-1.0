const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

ReportModel = {
    getAllDeposits,
    getAllDepositByBranchId,
    getAllWithdraws,
    getAllWithdrawByBranchId,
    getAllTransfers,
    getAllLoanPayments,
    getAllLoanPaymentByBranchId,
    getUnpaidLoan,
    getUnpaidLoanByBranchId,
    getWithdrawByAccId,
    getDepositByAccId,
    getTransferByAccId,
    getAllTransferByBranchId
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

function getAllDepositByBranchId(id, limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from(select * from deposit where acc_id in (select acc_id from account where branch_id = ?)) P natural join transaction order by date limit=?;',[id, limit], (error, rows, fields) => {
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

function getAllWithdrawByBranchId(id, limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from(select * from withdraw where acc_id in (select acc_id from account where branch_id = ?)) P natural join transaction order by date limit=?;',[id, limit], (error, rows, fields) => {
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

function getAllTransferByBranchId(id, limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from(select * from transfer where from_acc_id in (select acc_id from account where branch_id = ?)) P natural join transaction order by date limit=?;',[id, limit], (error, rows, fields) => {
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
        db.query('SELECT * from transaction natural join loan_payment where  trans_type = "LOAN" and date between ? and ?',dates, (error, rows, fields) => {
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

function getAllLoanPaymentByBranchId(id, limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from detailed_loan_payment where branch = ? order by date limit ?',[id, limit], (error, rows, fields) => {
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

function getUnpaidLoanByBranchId(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from loan_detail where loan_state = "NOT-PAID" and branch=?', id,(error, rows, fields) => {
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
        db.query('select * from withdraw natural join main_db.transaction where acc_id = ? limit ?', [id, limit],(error, rows, fields) => {
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

function getDepositByAccId(id,limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from deposit natural join main_db.transaction where acc_id = ? limit ?', [id, limit],(error, rows, fields) => {
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

function getTransferByAccId(id,limit) {
    return new Promise((resolve, reject) => {
        db.query('select * from transfer natural join main_db.transaction where from_acc_id = ? limit ?', [id, limit],(error, rows, fields) => {
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

module.exports = ReportModel;