
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')


const DropdownService = {
    getBranches,
    getPosts,
    getSavingAccPlans,
    getLoanPlans
}


function getBranches() {
    return new Promise((resolve, reject) => {
        db.query('SELECT branch_id, branch_name from branch', (error, rows, fields) => {
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

function getPosts() {
    return new Promise((resolve, reject) => {
        db.query('SELECT post_id, post_name from post', (error, rows, fields) => {
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

function getSavingAccPlans() {
    return new Promise((resolve, reject) => {
        db.query('SELECT acc_plan_id, name from saving_account_plan', (error, rows, fields) => {
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

function getLoanPlans() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from loan_plan', (error, rows, fields) => {
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

module.exports = DropdownService;