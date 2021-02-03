

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
const helpers = {
  errorsToList
}

module.exports = helpers;