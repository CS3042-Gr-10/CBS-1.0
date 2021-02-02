
const db = require('../config/database');
var dbFunc = require('../config/db-function');

var EmpModel = {
    getEmpDetails,
    addEmployee
}

function getEmpDetails(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from Employee where emp_id = ?',id, (error, rows, fields) => {
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

function addEmployee(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_emp.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_emp(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, acc, (error, rows, fields) => {

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

module.exports = EmpModel;