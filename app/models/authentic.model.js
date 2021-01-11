const db = require('../../config/database');
const dbFunc = require('../../config/db-function');
const bcrypt = require('bcryptjs');

const authenticModel = {
    authentic: authentic,
    signup: signup
};

function authentic(authenticData) {
    return new Promise((resolve, reject) => {
        //console.log(`SELECT * FROM User WHERE username ='${authenticData.login_username}'`);
        db.query(`SELECT * FROM User WHERE username ='${authenticData.login_username}'`, (error, rows, fields) => {
            if (error) {
                //console.log('error');
                dbFunc.connectionRelease;
                reject(error);
            } else {
                //console.log('no error')
                //console.log(rows[0].password);
                bcrypt.compare(authenticData.login_pwd, rows[0].password, function (err, isMatch) {
                    if (err) {
                        dbFunc.connectionRelease;
                        reject(error);
                    } else if (isMatch) {
                        dbFunc.connectionRelease;
                        console.log(rows[0]);
                        resolve(rows);
                    }
                    else {
                        dbFunc.connectionRelease;
                        reject({"success":false,"message":"Password doesn't match"});
                    }
                });

            }
        });
    });

}


function signup(user) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                db.query("SELECT * FROM user WHERE username='"+user.username+"'", (error, rows, fields) => {
                    if (error) {
                        dbFunc.connectionRelease;
                        reject(error);
                    } else if(rows.length>0) {
                        dbFunc.connectionRelease;
                        reject({"success":false,"message":"user already exist ! try with different user"});
                    } else {
                        db.query("INSERT INTO user(username,password)VALUES('" + user.username + "','" + user.password + "')", (error, rows, fields) => {
                            if (error) {
                                dbFunc.connectionRelease;
                                reject(error);
                            } else {
                                dbFunc.connectionRelease;
                                resolve(rows);
                            }
                        });
                    }
                });
            })

        });
    });
}

module.exports = authenticModel;



