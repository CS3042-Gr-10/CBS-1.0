const db = require('../../config/database');
const dbFunc = require('../../config/db-function')

const BranchModel = {
    branchDetailsOfManager,
}

async function branchDetailsOfManager(bm_id){
    // console.log(bm_id);
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM branch WHERE branch_manager = ?`, bm_id, (error, rows, fields) => {
            if (!!error) {
                dbFunc.connectionRelease;
                reject(error);
            } else {

                dbFunc.connectionRelease;
                resolve(rows[0]);
            }
        });
    });
}

module.exports = BranchModel;