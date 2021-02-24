const authenticModel = require("../models/authentic.model");


const authenticService = {
    authentic: authentic,
    changePassword,
    changeUsername,
};

function changeUsername(data,user_id){
    return  new Promise((resolve, reject)=>{
        authenticModel.changeUsername(data,user_id).then((data)=>{
            resolve(data)
        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    });
}

function authentic(authenticData) {
    return new Promise((resolve,reject) => {
        authenticModel.authentic(authenticData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    })
   
}

function changePassword(data,user_id){
    return  new Promise((resolve, reject)=>{
        authenticModel.changePassword(data,user_id).then((data)=>{
            resolve(data)
        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    });
}



module.exports = authenticService;

