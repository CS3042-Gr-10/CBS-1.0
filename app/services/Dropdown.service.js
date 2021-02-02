
const db = require('../../config/database');
var dbFunc = require('../../config/db-function');

const DropdownService = {
    getBranches
}

function getBranches() {
    return new Promise((resolve, reject) => {
        db.query('SELECT branch_id, branch_name from Branch', (error, rows, fields) => {
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