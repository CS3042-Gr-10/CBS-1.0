const ifLoggedIn = require('./../Middleware/ifLoggedIn');
const Errors = require('./../../common/error');
const ifCustomer = require('./../Middleware/ifCustomer');
const CustomerModel = require('../models/Customer.model');
const AccountModel = require('../models/Account.model');
const OrganizationModel = require('../models/Organization.model');
const UserModel = require('../services/user.service');

function init(router) {
    router.use('/Customer', ifLoggedIn)
    router.use('/Customer', ifCustomer)
    router.route('/Customer/:id')
        .get(indexAction);
    router.route('/Customer/:id/startFD')
      .get(startFDPage)
      .post(startFDAction)
}

async function indexAction(req,res){
    //EmployeeService.
    try{
        const userID = req.session.user.user_id;
        const owner_type = await AccountModel.getAccountType(userID);
        let Cus;

        if (owner_type.owner_type = "U"){
            Cus = await CustomerModel.getCustomerDetailsById(userID);
        }else{
            Cus = await OrganizationModel.getOrgDetails(userID);
        }

        // console.log(Emp);
        if (!Cus){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        Cus = {
            ...Cus,
            ...req.session.user
        }

        console.log(Cus);
        res.render('customer_dashboard',
          {
              url_params: req.params,
              error:req.query.error,
              success:req.query.success,
              User:Cus

          }
        )
    }catch (e){
        res.redirect(`/?error=${e}`);
    }
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