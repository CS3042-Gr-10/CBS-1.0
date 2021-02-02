
const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const CustomerModel = {
    getCustomerDetails,
    getCustomerSavAccDetail,
    getCustomerFDDetail,
    getCustomerDetailsByNIC,
    addCustomer
}

function getCustomerDetails(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from Customer where customer_id = ?',id, (error, rows, fields) => {
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

function getCustomerSavAccDetail(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT acc_id, branch_id, acc_type, created_date from Account where user_id = ?',id, (error, rows, fields) => {
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

function getCustomerFDDetail(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT acc_id, branch_id, acc_type, created_date from FixedDeposit where customer_id = ?',id, (error, rows, fields) => {
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

function getCustomerDetailsByNIC(nic) {
  return new Promise((resolve, reject) => {
      db.query('SELECT * from Customer where NIC = ?',nic, (error, rows, fields) => {
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

function addCustomer(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_customer.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_customer(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, acc, (error, rows, fields) => {

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

module.exports = CustomerModel;