//const userService = require('../services/user.service');
const schema = require('../schema/userValidationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');


function init(router) {
    router.route('/user')
        .get(getAllUsers)
        .post(addUser);
    router.route('/user/:id')
        .get(test)
        .delete(deleteUser)
        .put(updateUser); 
}

function getAllUsers(req,res) {
  userService.getAllUser().then((data) => {
      res.send(data);
    }).catch((err) => {
      mail.mail(err);
      res.send(err);
    });
}

function test(req,res){
    res.send('<h1>Lol heyy 180118T</h1>');
}

function getUserById(req,res) {

  let userId = req.params;

  var json_format = iValidator.json_schema(schema.getSchema,userId,"user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }

  userService.getUserById(userId).then((data) => {
      res.send(data);
    }).catch((err) => {
      mail.mail(err);
      res.send(err);
    });
}

function addUser(req,res) {
  var userData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, userData, "user");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }

  userService.addUser(userData).then((data) => {
    res.json(data);
  }).catch((err) => {
    mail.mail(err);
    res.json(err);
  });

}


function updateUser(req,res) {
   var userData=req.body;
   var id = req.params.id;
   userService.updateUser(id,userData).then((data)=>{
      res.json(data);
  }).catch((err)=>{
      mail.mail(err);
      res.json(err);
   });
}


function deleteUser(req,res) {
  var delId = req.params.id;
  userService.deleteUser(delId).then((data)=>{
    res.json(data);
  }).catch((err)=>{
     mail.mail(err);
      res.json(err);
  });
}


module.exports.init = init;



