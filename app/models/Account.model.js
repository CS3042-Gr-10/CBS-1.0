
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const AccountModel = {
    addSavingAccount,
    addCurrentAccount,
    depositMoneySvAcc,
    withdrawSvAcc,
    getAccountOwner,
    getAccountType,
    getAccount,
    transferMoney,
    getSavingAccount,
    getCurrentAccount,
    getCustomerAccDetail,
}

function addSavingAccount(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_saving_account.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_saving_account(?,?,?,?)`, acc, (error, rows, fields) => {

            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0][0]);
            }
        });
    });
}

function addCurrentAccount(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_current_account.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_current_account(?,?,?)`, acc, (error, rows, fields) => {

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

function depositMoneySvAcc(deposit) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/deposit_mn_sv_acc.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL deposit_mn_sv_acc(?,?,?)`, deposit, (error, rows, fields) => {

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

function getAccountOwner(accNum) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/deposit_mn_sv_acc.sql
    return new Promise((resolve, reject) => {
        db.query(`select user from account where acc_id=?`, accNum, (error, rows, fields) => {

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

function getAccountType(accNum) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/deposit_mn_sv_acc.sql
    return new Promise((resolve, reject) => {
        db.query(`select owner_type from account_owner where user_id=?`, accNum, (error, rows, fields) => {

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

function getAccount(accNum) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/deposit_mn_sv_acc.sql
    return new Promise((resolve, reject) => {
        db.query(`select * from account where acc_id=?`, accNum, (error, rows, fields) => {

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



function withdrawSvAcc(wth) {

    //TODO: set "wth" attribute appropriate to the data passing -- checkout ../document/sql_scripts/withdraw_mn_sv_acc.sql
    return new Promise((resolve, reject) => {
        db.query(`CALL withdraw_mn_sv_acc(?,?,?)`, wth, (error, rows, fields) => {

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

function transferMoney(slip) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/transfer_mn.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL transfer_mn(?,?,?,?)`, slip, (error, rows, fields) => {

            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0][0]);
            }
        });
    });
}

function getCustomerAccDetail(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT acc_id, branch_id, acc_type, created_date from account where user = ?',id, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
                return (false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows);
                return (rows);
            }
        });
    });
}

function getSavingAccount(acc_id){
    return new Promise((resolve, reject) => {
        db.query('SELECT * from saving_account natural join saving_account_plan where acc_id=?',acc_id, (error, rows, fields) => {
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

function getCurrentAccount(acc_id){
    return new Promise((resolve, reject) => {
        db.query('SELECT * from current_deposit where acc_id=?',acc_id, (error, rows, fields) => {
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

module.exports = AccountModel;