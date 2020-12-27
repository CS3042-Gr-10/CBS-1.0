const authenticService = require('../services/authentic.service');
var schema = require('../schema/loginValidationSchema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var errorMessage = require('../../common/error-methods');
var mail = require('./../../common/mailer.js');
const errortype = require('../../common/error-type');
const GeneralError = errortype.RedirectGeneralError;

const jwt = require('jsonwebtoken');

function init(router) {
    router.route('/login')
        .post(loginAction);
}

function clean(backend_data){
    const data = backend_data;
    return(data)
}

function loginAction(req,res) {
    console.log(req.body);
    const authenticData = req.body;

    //Validating the input entity
    const json_format = iValidator.json_schema(schema.postSchema, authenticData, "authentic");
    console.log(json_format.valid == false);
    if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
    }

    authenticService.authentic(authenticData).then((data) => {
    if(data) {
        const username = data.username;
        const acl = data.acl;
        //const token = jwt.sign({username},'my_secret_key',{ expiresIn: 60*60*24 });
        //res.json({
        //          "success":true,
        //          "data":data,
                  //"token":token
        //});
        const cleaned = clean(data);
        if(acl === "employee"){
            res.render(
                'employee_dashboard',
                cleaned
            )
        }else if (acl === "manager"){
            res.render(
                'employee_dashboard',
                cleaned
            )
        }else if (acl === "customer"){
            res.render(
                'manager_dashboard',
                cleaned
            )
        }else if (acl === "admin"){
            res.render(
                'admin_dashboard',
                cleaned
            )
        }else{
            //error
        }
    }
  }).catch((err) => {
    mail.mail(err);
    res.json(err);
  });

}



function signup(req,res) {
  var signUpData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, signUpData, "signUpData");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }

   authenticService.signup(signUpData).then((data) => {
    if(data) {
       res.json({
         "success":true,
         "data":data
       });
     }
   }).catch((err) => {
     mail.mail(err);
     res.json(err);
   });

}



module.exports.init = init;



