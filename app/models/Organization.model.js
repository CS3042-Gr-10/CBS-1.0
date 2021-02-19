
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const OrgModel = {
    getOrgDetails,
    addOrg,
    getOrgDetailsByUsername
};

function getOrgDetails(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from organization where user_id = ?',id, (error, rows, fields) => {
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

function getOrgDetailsByUsername(username) {
    return new Promise((resolve, reject) => {
        db.query('SELECT o.* from organization as o natural join user where username = ?',username, (error, rows, fields) => {
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



function addOrg(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_org.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_org(?,?,?,?,?,?)`, acc, (error, rows, fields) => {

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

module.exports = OrgModel;