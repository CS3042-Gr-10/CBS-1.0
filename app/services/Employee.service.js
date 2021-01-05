const db = require('../../config/database');
const dbFunc = require('../../config/db-function');

function storeEmployee(emp){
    try {  
        let results = []
  
        return new Promise(function(resolve, reject) {
          db.beginTransaction(function(err) {
              if (err) { throw err; }
              db.query(`INSERT INTO User (username, password, acc_level, user_type) values (?, ?, ?, ?)`, [emp.username, emp.password, 2, 'E'], function(err, result) {
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }                
             
                db.query('SELECT user_id FROM User WHERE username = ?',[emp.username], function(err, result) {
                  if (err) { 
                    db.rollback(function() {
                      throw err;
                    });
                  } 
                  const user_id = result.user_id; 

                  db.query('INSERT INTO Employee (emp_id, name, first_name, last_name, dob, create_date, postal_code, NIC, branch_id, gender, house_no, street, city, post_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[user_id, emp.name, emp.first_name, emp.last_name, emp.dob, emp.create_date, emp.postal_code, emp.nic, emp.branch_id, emp.gender, emp.house_no, emp.street, emp.city, emp.post_id], function(err, result){
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
        
      
      } catch (error) {
        return Promise.reject(error)
      }
}