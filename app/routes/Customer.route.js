const schema = require('../schema/userValidationSchema.json')
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const errortype = require('../../common/error-type');
const mail = require('./../../common/mailer.js');
const ifLoggedIn = require('./../Middleware/ifLoggedIn');
const Errors = require('./../../common/error');
const ifCustomer = require('./../Middleware/ifCustomer');
const CustomerService = require('../services/Customer.service');
const UserService = require('../services/user.service');
const GeneralError = errortype.RedirectGeneralError;

function init(router) {
    router.use('/Customer', ifLoggedIn)
    router.use('/Customer', ifCustomer)
    router.route('/Customer')
        .get(GeneralError)
    router.route('/Customer/:id')
        .get(indexAction);
    router.route('/Customer/:id/startFD')
      .get(startFDPage)
      .post(startFDAction)
}

async function indexAction(req,res){
    //EmployeeService.
    const userID = req.session.user.username;
    let userID_2 = req.params.id;
    try{
        const User = await UserService.getUserById(userID);
        if (!User){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        res.render('customer_dashboard',
          {
              url_params: req.params,
              User:User
          }
        )
    }catch (e){
        res.redirect(`/?error=${e}`);
    }


    //userService.getUserById(userId).then((data) => {

    //}).catch((err) => {
    //    mail.mail(err);
    //    res.send(err);
    //});
}

function startFDPage(req,res){
    //starting an fd by customer to page.
    res.render('')

}

function startFDAction(req, res){
    // to create FD
    try{

    }catch (e){

    }
}

function transferAction(req,res){
    //transfering funds between accounts
}

function checkProfileAction(req,res){
    //check personal details with list of accounts
}

function checkAccountAction(req,res){
    //check details of a single account (savings account , checking account)
}

function listFDsAction(req,res){
    //list of the the fd and their details.

}

function listLoansAction(req,res){
    //listing the current loans the person has
}

function applySelfLoanAction(req,res){
    //check if eligible for a loan and then allow loan registration
}

function payLoanInstallment(req,res){
    //no clueeeeeeeee
}


module.exports.init = init;