
const db = require('../../config/database');
const dbFunc = require('../../config/db-function');
const bcrypt = require('bcryptjs');

const authenticModel = {
    authentic: authentic,
};

function authentic(authenticData) {
    return new Promise((resolve, reject) => {
        console.log(authenticData);
        console.log(`SELECT * FROM User WHERE username ='${authenticData.username}'`);
        db.query(`SELECT * FROM User WHERE username ='${authenticData.username}'`, (error, rows, fields) => {
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
                        console.log(rows[0]);
                        dbFunc.connectionRelease;
                        resolve(rows);
                    }
                    else {
                        reject({"success":false,"message":"password doesn't match"});
                    }
                });

            }
        });
    });

}


module.exports = authenticModel;


