
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const AccountModel = {
    addSavingAccount,
    addCurrentAccount,
    depositMoneySvAcc,
    withdrawSvAcc,
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
                resolve(rows);
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
                resolve(rows);
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
                resolve(rows);
            }
        });
    });
}

function withdrawSvAcc(deposit) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/withdraw_sv_acc.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL withdraw_mn_sv_acc(?,?,?,?,?)`, deposit, (error, rows, fields) => {

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

function transferMoney(slip) {

    //TODO: set "deposit" attribute appropriate to the data passing -- checkout ../document/sql_scripts/transfer_mn.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL transfer_mn(?,?,?,?)`, slip, (error, rows, fields) => {

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

module.exports = AccountModel;