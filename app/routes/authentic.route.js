const authenticService = require('../services/authentic.service');
const {LogInInfo, changePasswordInfo, changeUsernameInfo} = require('../schema/Authentication')
const mail = require('./../../common/mailer.js');
const UserModel = require('../models/User.model');
const Errors = require('../../common/error');
const ifNotLoggedIn = require('../Middleware/ifNotLoggedIn');
const ifLoggedIn = require('../Middleware/ifLoggedIn');
const SessionHandler = require('../../config/SessionHandler');
const { hash_password } = require('../../common/helpers');

function init(router) {
    router.get('/',ifNotLoggedIn,loginPage);
    router.post('/login',ifNotLoggedIn,authentic);
    router.post('/changePassword/:user_id',ifLoggedIn,changePassword)
    router.post('/changeUsername/:user_id',ifLoggedIn,changeUsername)
    router.get('/logout',ifLoggedIn,logout)
}

async function changeUsername(req,res){
    try {
        const {value,error} = await changeUsernameInfo.validate(req.body);
        if (error) throw error;

        if(!(req.session.user.username === value.currentUsername)){
            throw new Errors.Conflict("Current username is wrong");
        }

        const AlreadyRegistered = await UserModel.getUserUsername(value.newUsername);
        if(AlreadyRegistered) throw  new Errors.Conflict("User Already Exists");


        console.log(value,req.params.user_id);

        authenticService.changeUsername(value,req.params.user_id).then((data)=>{
            req.session.user.username = value.newUsername;

            if(req.session.user.acc_level == 'CUSTOMER'){
                res.redirect(`/Customer/${req.params.user_id}?success=Username changed`)
            } else if (req.session.user.acc_level == 'EMPLOYEE'){
                res.redirect(`/Employee/${req.params.user_id}?success=Username changed`)
            }else if (req.session.user.acc_level == 'BANK-MANAGER'){
                res.redirect(`/BankManager/${req.params.user_id}?success=Username changed`)
            }else {
                res.redirect(`/Admin/${req.params.user_id}?success=Username changed`)
            }
        }).catch((e)=>{
            if(req.session.user.acc_level == 'CUSTOMER'){
                res.redirect(`/Customer/${req.params.user_id}?error=${e}`)
            } else if (req.session.user.acc_level == 'EMPLOYEE'){
                res.redirect(`/Employee/${req.params.user_id}?error=${e}`)
            }else if (req.session.user.acc_level == 'BANK-MANAGER'){
                res.redirect(`/BankManager/${req.params.user_id}?error=${e}`)
            }else {
                res.redirect(`/Admin/${req.params.user_id}?error=${e}`)
            }
        });


    }catch (e) {
        if(req.session.user.acc_level == 'CUSTOMER'){
            res.redirect(`/Customer/${req.params.user_id}?error=${e}`)
        } else if (req.session.user.acc_level == 'EMPLOYEE'){
            res.redirect(`/Employee/${req.params.user_id}?error=${e}`)
        }else if (req.session.user.acc_level == 'BANK-MANAGER'){
            res.redirect(`/BankManager/${req.params.user_id}?error=${e}`)
        }else {
            res.redirect(`/Admin/${req.params.user_id}?error=${e}`)
        }
    }
}

async function changePassword(req,res){
    try {
        const {value,error} = await changePasswordInfo.validate(req.body);
        if (error) throw error;

        const data = {
            ...value,
            hashPassword:await hash_password(value.newPassword)
        }

        console.log(data,req.params.user_id)
        authenticService.changePassword(data,req.params.user_id).then((data)=>{
            if(req.session.user.acc_level == 'CUSTOMER'){
                res.redirect(`/Customer/${req.params.user_id}?success=Password changed`)
            } else if (req.session.user.acc_level == 'EMPLOYEE'){
                res.redirect(`/Employee/${req.params.user_id}?success=Password changed`)
            }else if (req.session.user.acc_level == 'BANK-MANAGER'){
                res.redirect(`/BankManager/${req.params.user_id}?success=Password changed`)
            }else {
                res.redirect(`/Admin/${req.params.user_id}?success=Password changed`)
            }
        }).catch((e)=>{
            if(req.session.user.acc_level == 'CUSTOMER'){
                res.redirect(`/Customer/${req.params.user_id}?error=${e}`)
            } else if (req.session.user.acc_level == 'EMPLOYEE'){
                res.redirect(`/Employee/${req.params.user_id}?error=${e}`)
            }else if (req.session.user.acc_level == 'BANK-MANAGER'){
                res.redirect(`/BankManager/${req.params.user_id}?error=${e}`)
            }else {
                res.redirect(`/Admin/${req.params.user_id}?error=${e}`)
            }
        });


    }catch (e) {
        if(req.session.user.acc_level == 'CUSTOMER'){
            res.redirect(`/Customer/${req.params.user_id}?error=${e}`)
        } else if (req.session.user.acc_level == 'EMPLOYEE'){
            res.redirect(`/Employee/${req.params.user_id}?error=${e}`)
        }else if (req.session.user.acc_level == 'BANK-MANAGER'){
            res.redirect(`/BankManager/${req.params.user_id}?error=${e}`)
        }else {
            res.redirect(`/Admin/${req.params.user_id}?error=${e}`)
        }
    }
}

function loginPage(req,res){
  res.render('login',
    {
      error: req.query.error,
      success:req.query.success
    }
  );
}

async function authentic (req, res) {
  const authenticData = req.body;

  //Validating the input entity
  try {
    const { value, error } = await LogInInfo.validate(req.body);
    if (error) throw (error);

    const user = await UserModel.userExists(authenticData.username);
    if(!user) throw new Errors.NotFound("Incorrect Username");

    const data = await authenticService.authentic(authenticData);

      console.log(data)
      req.session.user = {};
      req.session.user.user_id = data.user_id;
      req.session.user.email = data.email;
      req.session.user.user_type = data.user_type;
      req.session.user.username = data.username;
      req.session.user.acc_level = data.acc_level;

      await new Promise(r => setTimeout(r, 500));
      if(data.is_deleted == 1){
          throw new Errors.Forbidden("User Account is deleted");
      }
      if (data.acc_level === 'CUSTOMER') {
          res.redirect(`/Customer/${req.session.user.user_id}`)
      } else if (data.acc_level === 'EMPLOYEE') {
          res.redirect(`/Employee/${req.session.user.user_id}`)
      } else if (data.acc_level === 'BANK-MANAGER') {
          res.redirect(`/BankManager/${req.session.user.user_id}`)
      } else{
          res.redirect(`/Admin/${req.session.user.user_id}`)
      }

  } catch (err) {
      res.redirect(`/?error=${err.message}`);
  }
}


function signup(req,res) {
  const signUpData = req.body

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
  try{
      if (req.session.user){
          req.session.user = undefined;
      }
      res.redirect('/')
  }catch(e)
    {
        console.log(e)
        res.redirect(`/?error=${e}`)
    }
}






module.exports.init = init;



