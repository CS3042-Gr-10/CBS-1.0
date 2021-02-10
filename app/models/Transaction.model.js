const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const TransactionModel = {
    getAllDepositDetailByID,
    getAllWithdrawDetailByID
}

function getAllDepositDetailByID(id) {
    //return columns : trans_id | trans_type | acc_id | deposit_type | amount | date
    return new Promise((resolve, reject) => {
        db.query('select trans_id, trans_type, acc_id, deposit_type, amount, date from (select trans_id, deposit_type, acc_id from Deposit where acc_id in (select acc_id from Account where user = ?)) as P natural join (select * from Transaction where is_deleted = 0) as Q'
        ,id, (error, rows, fields) => {
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

function getAllWithdrawDetailByID(id) {
    //return columns : trans_id | trans_type | acc_id | withdraw_type | amount | date 
    return new Promise((resolve, reject) => {
        db.query('select trans_id, trans_type, acc_id, withdraw_type, amount, date from (select trans_id, withdraw_type, acc_id from Withdraw where acc_id in (select acc_id from Account where user = ?)) as P natural join (select * from Transaction where is_deleted = 0) as Q'
        ,id, (error, rows, fields) => {
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

module.exports = TransactionModel;