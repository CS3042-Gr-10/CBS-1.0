
const db = require('../../config/database');
const dbFunc = require('../../config/db-function');
const bcrypt = require('bcryptjs');

const authenticModel = {
    authentic: authentic,
    changePassword,
    changeUsername,
};

function changeUsername(authenticData,user_id) {
    return new Promise((resolve, reject) => {
        //console.log(authenticData);
        //console.log(`SELECT * FROM User WHERE username ='${authenticData.username}'`);
        db.query(`SELECT * FROM user WHERE user_id ='${user_id}'`, (error, rows, fields) => {
            if (error) {
                //console.log('error');
                dbFunc.connectionRelease;
                reject(error);
            } else {
                //console.log('no error')
                //console.log(rows[0].password);
                if(!rows){
                    dbFunc.connectionRelease;
                    reject("Empty database");
                }


                db.query(`UPDATE user SET username= '${authenticData.newUsername}' WHERE user_id ='${user_id}'`, (error, rows, fields) => {
                    if (error) {
                        //console.log('error');
                        dbFunc.connectionRelease;
                        console.log(error);
                        reject(error);
                    }else {
                        resolve(rows)
                    }
                });


            }
        });
    });

}

function authentic(authenticData) {
    return new Promise((resolve, reject) => {
        //console.log(authenticData);
        //console.log(`SELECT * FROM User WHERE username ='${authenticData.username}'`);
        db.query(`SELECT * FROM user WHERE username ='${authenticData.username}'`, (error, rows, fields) => {
            if (error) {
                //console.log('error');
                dbFunc.connectionRelease;
                reject(error);
            } else {
                //console.log('no error')
                //console.log(rows[0].password);
                if(!rows){
                    dbFunc.connectionRelease;
                    reject("Empty database");
                }
                bcrypt.compare(authenticData.password, rows[0].password, function (err, isMatch) {
                    if (err) {
                        dbFunc.connectionRelease;
                        reject(error);
                    } else if (isMatch) {
                        // console.log(rows[0]);
                        dbFunc.connectionRelease;
                        resolve(rows[0]);
                    }
                    else {
                        reject({"success":false,"message":"password doesn't match"});
                    }
                });

            }
        });
    });

}

function changePassword(authenticData,user_id) {
    return new Promise((resolve, reject) => {
        //console.log(authenticData);
        //console.log(`SELECT * FROM User WHERE username ='${authenticData.username}'`);
        db.query(`SELECT * FROM user WHERE user_id ='${user_id}'`, (error, rows, fields) => {
            if (error) {
                //console.log('error');
                dbFunc.connectionRelease;
                reject(error);
            } else {
                //console.log('no error')
                //console.log(rows[0].password);
                if(!rows){
                    dbFunc.connectionRelease;
                    reject("Empty database");
                }


                db.query(`UPDATE user SET password= '${authenticData.hashPassword}' WHERE user_id ='${user_id}'`, (error, rows, fields) => {
                    if (error) {
                        //console.log('error');
                        dbFunc.connectionRelease;
                        console.log(error);
                        reject(error);
                    }else {
                        resolve(rows)
                    }
                });


            }
        });
    });

}


module.exports = authenticModel;


