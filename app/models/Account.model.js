
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const AccountModel = {
    addSavingAccount,
    addCurrentAccount,
    depositMoneySvAcc,
    withdrawSvAcc,
    getAccountOwner,
    getAccount,
    transferMoney
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
                resolve(rows[0]);
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



function withdrawSvAcc(deposit) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/withdraw_sv_acc.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL withdraw_sv_acc(?,?,?)`, deposit, (error, rows, fields) => {

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
                resolve(rows[0]);
            }
        });
    });
}

module.exports = AccountModel;