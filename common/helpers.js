const bcrypt = require('bcryptjs');

const errorsToList = (ObjList) => {
  console.log('#')
  console.log(ObjList);
  const list_messages = [];
  ObjList.forEach((element)=>{
    list_messages.push(element.message);
  });

  console.log(list_messages);

  return list_messages;
}

const checkOnlineFDAmount = (amount,fd_amount)=>{
  const percentage = 0.6;
  const upperlimit = 500000;
  // console.log(amount);

  let max_possible;
  if(percentage*fd_amount >= upperlimit){
    max_possible = upperlimit
  }else {
    max_possible = percentage*fd_amount
  }
  // console.log(max_possible)

  if(max_possible >= amount){
    return {max:max_possible,possibility:true};
  }
  return {max:max_possible,possibility:false};

};


const ObjectToList = (obj) => {
  const list = [];
  Object.keys(obj).forEach((key)=>{
    list.push(obj[key]);
  });

  return list;
}




const hash_password = async (password) => {
  console.log(password);
  const saltRounds=10
  let hashedPassword=await bcrypt.hash(password, saltRounds);
  return hashedPassword
}

const bufferToInt = (list,columns)=>{
  console.log(list);
  columns.forEach((column)=>{
      list.forEach((data)=>{
        if(!Number.isInteger(data[column])){
          data[column] = parseInt(data[column])
        }
      });
    });
  console.log(list);
}


const helpers = {
  errorsToList,
  ObjectToList,
  hash_password,
  bufferToInt,
  checkOnlineFDAmount,
}

module.exports = helpers;