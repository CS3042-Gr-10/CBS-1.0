const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

ReportModel = {
    getAllDeposits,
    getAllWithdraws,
    getAllTransfers
}

function getAllDeposits(dates) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from transaction natural join deposit',id, (error, rows, fields) => {
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
        db.query('SELECT * from transaction natural join withdraw',id, (error, rows, fields) => {
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
        db.query('SELECT * from transaction natural join transfer',id, (error, rows, fields) => {
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

