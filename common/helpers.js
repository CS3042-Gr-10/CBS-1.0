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
  bufferToInt
}

module.exports = helpers;