const authenticService = require('../services/authentic.service');
const schema = require('../schema/loginValidationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');
const errortype = require('../../common/error-type');
const SessionHandler = require('../../config/SessionHandler')
const GeneralError = errortype.RedirectGeneralError;

const jwt = require('jsonwebtoken');

function init(router) {
    router.route('/')
      .get(loginPage);
    router.route('/login')
        .post(authentic); 
    router.route('/logout')
        .get(logout)
        .post(logout);
}

function loginPage(req,res){
  res.render('login',
    {
      error: req.query.error,
    }
  );
}

function authentic(req,res) {
    const authenticData = req.body;

    //Validating the input entity
    const json_format = iValidator.json_schema(schema.postSchema, authenticData, "authentic");
    if (json_format.valid == false) {
     return res.render(`/login?error=${json_format.errorMessage}`);
   }
   console.log(authenticData)
   authenticService.authentic(authenticData).then((data) => {
   if(data) {

       req.session.user = {};
       req.session.user.email = data.email;
       req.session.user.username = data.username;
       req.session.user.acc_level = data.acc_level;
       console.log(req.session.user)
        if (data.acc_level === 1){
            res.redirect(`/Customer/${req.session.user.username}`)
        }else if (data.acc_level === 2){
            res.redirect(`/Employee/${req.session.user.username}`)
        }else if (data.acc_level === 3){
            res.redirect(`/BankManager/${req.session.user.username}`)
            //something
        }else if (data.acc_level === 0){
            res.redirect(`/Admin/${req.session.user.username}`)
           //something
       }else{
            GeneralError(req,res);
        }
    }
  }).catch((err) => {
       res.redirect(`/?error=${err}`);
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

function logout(req, res){
  req.session.destroy(error => {
    if (error) {
      res.send('Error logging out')
    }
  });

  res.clearCookie(SESS_NAME);
  res.redirect('/')
}






module.exports.init = init;



