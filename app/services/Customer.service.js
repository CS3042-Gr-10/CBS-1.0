

const db = require('../../config/database');
const dbFunc = require('../../config/db-function');


const CustomerModel = require("../models/Customer.model");

function storeCustomer(customer){
    try {  
        let results = []
  
        return new Promise(function(resolve, reject) {
          db.beginTransaction(function(err) {
              if (err) { throw err; }
              db.query(`INSERT INTO User (username, password, acc_level, user_type) values (?, ?, ?, ?)`, [customer.username, customer.password, 2, 'A'], function(err, result) {
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }                
             
                db.query(`SELECT user_id FROM User WHERE username = ?`,[customer.username], function(err, result) {
                  if (err) { 
                    db.rollback(function() {
                      throw err;
                    });
                  } 
                  const user_id = result.user_id; 

                    db.query(`INSERT INTO AccountOwner (owner_id, owner_type) values (?, ?)`,[user_id, 'C'], function(err, result){
                        if (err) { 
                            db.rollback(function() {
                              throw err;
                            });
                          }

                        db.query('INSERT INTO Employee (emp_id, name, first_name, last_name, dob, create_date, postal_code, NIC, gender, house_no, street, city, post_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[user_id, emp.name, emp.first_name, emp.last_name, emp.dob, emp.create_date, emp.postal_code, emp.nic, emp.branch_id, emp.gender, emp.house_no, emp.street, emp.city, emp.post_id], function(err, result){
                            if (err) { 
                                db.rollback(function() {
                                throw err;
                                });
                            }

                            db.commit(function(err) {
                                if (err) { 
                                db.rollback(function() {
                                    throw err;
                                });
                                }
                                console.log('Transaction Completed Successfully.');
                                db.end();
                            });
                        });
                    });
                });
              });
            });
          });
        
      
      } catch (error) {
        return Promise.reject(error)
      }
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

function addCustomer(customer) {

    //TODO: set "user" attribute appropriate to the data passing -- checkout ../document/user_reg.txt 
    return new Promise((resolve, reject) => {
        db.query(`CALL user_reg(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, customer, (error, rows, fields) => {

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
