const authenticService = require('../services/authentic.service');
const {LogInInfo} = require('../schema/Authentication')
const mail = require('./../../common/mailer.js');
const SessionHandler = require('../../config/SessionHandler');


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
    authenticService.authentic(authenticData).then((data) => {
      if (data) {
         console.log(data.acc_level)
        req.session.user = {};
        req.session.user.user_id = data.user_id;
        req.session.user.email = data.email;
        req.session.user.user_type = data.user_type;
        req.session.user.username = data.username;
        req.session.user.acc_level = data.acc_level;

        if(data.is_deleted == 1){
          throw ("User Account is deleted");
        }
        if (data.acc_level === 'CUSTOMER') {
          res.redirect(`/Customer/${req.session.user.username}`)
        } else if (data.acc_level === 'EMPLOYEE') {
          // console.log('choosen')
          res.redirect(`/Employee/${req.session.user.username}`)
        } else if (data.acc_level === 'BANK-MANAGER') {
          res.redirect(`/BankManager/${req.session.user.username}`)
          //something
        } else{
          res.redirect(`/Admin/${req.session.user.username}`)
          //something
        }
      }
    }).catch((err) => {
      res.redirect(`/?error=${err}`);
    });
  } catch (e) {
    res.redirect(`/?error=${e}`);
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
  req.session.destroy(error => {
    if (error) {
      res.send('Error logging out')
    }
  });

  res.clearCookie(SESS_NAME);
  res.redirect('/')
}






module.exports.init = init;



