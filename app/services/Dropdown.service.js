
const db = require('../../config/database');
var dbFunc = require('../../config/db-function');

const DropdownService = {
    getBranches,
    getPosts
}


function getBranches() {
    return new Promise((resolve, reject) => {
        db.query('SELECT branch_id, branch_name from Branch', (error, rows, fields) => {
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
        db.query('SELECT post_id, post_name from Post', (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(false);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
            }
        });
    });
}

module.exports = DropdownService;