const db = require('../../config/database')
const dbFunc = require('../../config/db-function')

const userModel = {
  getUserUsername: getUserByUsername,
  getUserByEmail:getUserByEmail,
  getUserByID:getUserByID,
  userExists

}

function getUserByUsername(username) {
    return new Promise((resolve,reject) => {
        db.query(`SELECT user_id,user_type,username,email,acc_level,is_deleted FROM user WHERE username = ?`,username,(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
                return error;
            } else {
                dbFunc.connectionRelease;
                resolve(rows[0]);
                return rows[0];
            }
       });
    });
}

function userExists(username){
    return new Promise((resolve,reject) => {
        db.query(`SELECT user_id FROM user WHERE username = ?`,username,(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
                return error;
            } else {
                dbFunc.connectionRelease;
                console.log(rows)
                if(rows[0] && rows[0].user_id){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
        });
    });
}

function getUserByID(user_id) {
  return new Promise((resolve,reject) => {
    db.query(`SELECT user_id,user_type,username,email,acc_level,is_deleted FROM user WHERE user_id = ?`,user_id,(error,rows,fields)=>{
      if(!!error) {
        dbFunc.connectionRelease;
        reject(error);

      } else {
        dbFunc.connectionRelease;
        resolve(rows[0]);

      }
    });
  });
}

function getUserByEmail(email) {
  // console.log(email);
  return new Promise((resolve,reject) => {
    db.query(`SELECT user_id,user_type,username,email,acc_level,is_deleted FROM user WHERE email = ?`,email,(error,rows,fields)=>{
      if(!!error) {
        dbFunc.connectionRelease;
        reject(error);
        return error;
      } else {
        dbFunc.connectionRelease;
        resolve(rows[0]);
        return rows[0];
      }
    });
  });
}

function getUserDetailById(id) {
    try {  
        let results = []
  
        return new Promise(function(resolve, reject) {
          db.beginTransaction(function(err) {

            subType1 = id.substring(1,2);
            subType2 = id.substring(2,3);
            id_int = id.substring(3);

            table = 'User';
            if (subType1 === "E"){
                selects = ''
                table = "Employee"
            }
            else if (subType2 === "U"){
                table = "User"
            }else{
                table = "Organization"
            }

              if (err) { throw err; }
              // select name, NIC, address from User where customer_id = int_id;
              db.query('YOUR QUERY', "PLACE HOLDER VALUES", function(err, result) {
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }
             
                const log = result.insertId;
             
                db.query('ANOTHER QUERY PART OF TRANSACTION', log, function(err, result) {
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
       /* End Transaction */
          });
        
      
      } catch (error) {
        return Promise.reject(error)
      } 
}

function addUser(user) {
     return new Promise((resolve,reject) => {
         db.query("INSERT INTO test(name,age,state,country)VALUES('"+user.name+"','"+user.age+"','"+user.state+"','"+user.country+"')",(error,rows,fields)=>{
            if(error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
          });
        });
}



function updateUser(id,user) {
    return new Promise((resolve,reject) => {
        db.query("UPDATE test set name='"+user.name+"',age='"+user.age+"',state='"+user.state+"',country='"+user.country+"' WHERE id='"+id+"'",(error,rows,fields)=>{
            if(!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {
                dbFunc.connectionRelease;
                resolve(rows);
            }
       });    
    })
}


module.exports = userModel;

