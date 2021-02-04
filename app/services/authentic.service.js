const authenticModel = require("../models/authentic.model");


const authenticService = {
    authentic: authentic,
};

function authentic(authenticData) {
    return new Promise((resolve,reject) => {
        authenticModel.authentic(authenticData).then((data)=>{
            if( data.length === 1){
                resolve(data[0])
            }else {
                resolve(data)
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}



module.exports = authenticService;

