
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const EmpModel = {
    getEmpDetailsByID,
    getEmpDetailsByNIC,
    addEmployee
}

function getEmpDetailsByID(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from employee where user_id = ?',id, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                //console.log(error);
                reject(error);
            } else {
                //console.log(rows[0]);
                dbFunc.connectionRelease;
                resolve(rows[0]);
                return (rows[0]);
            }
        });
    });
}

function getEmpDetailsByNIC(nic) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from employee where NIC = ?',nic, (error, rows, fields) => {
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