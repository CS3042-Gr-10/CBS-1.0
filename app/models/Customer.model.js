
const db = require('../../config/database');
var dbFunc = require('../../config/db-function');

const CustomerModel = {
    getCustomerDetailsById,
    getCustomerDetailsByNIC,
    getAllCustomerDetails,
    getUserDetails,
    getCustomerSavAccDetail,
    getCustomerFDDetail,
    addCustomer
}

function getAllCustomerDetails() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from customer_detail', (error, rows, fields) => {
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

function getCustomerDetailsById(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from customer_detail where user_id = ?',id, (error, rows, fields) => {
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

function getUserDetails(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from user where user_id = ?',id, (error, rows, fields) => {
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

function getCustomerSavAccDetail(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT acc_id, branch_id, acc_type, created_date from account where user = ?',id, (error, rows, fields) => {
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

function getCustomerFDDetail(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT sv_acc_id, branch_id, acc_plan_id, opened_date from fixed_deposit where customer_id = ?',id, (error, rows, fields) => {
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

function getCustomerDetailsByNIC(nic) {
  return new Promise((resolve, reject) => {
      db.query('SELECT * from customer_detail where NIC = ?',nic, (error, rows, fields) => {
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

function addCustomer(acc) {

    //TODO: set "acc" attribute appropriate to the data passing -- checkout ../document/sql_scripts/add_customer.sql 
    return new Promise((resolve, reject) => {
        db.query(`CALL add_customer(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, acc, (error, rows, fields) => {

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