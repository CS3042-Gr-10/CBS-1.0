const BankManagerService = require('../services/BankManager.service');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const error_type = require('../../common/error-type');
const UserService = require('../services/user.service');
const Errors = require('../../common/error');
const GeneralError = error_type.RedirectGeneralError;

function init(router) {
    router.route('/Employee')
        .get(GeneralError)
    //router.route('/Employee/:id/registerCustomer')
    //    .get(registerCustomerAction)
    //    .post(registerCustomer)
}

async function indexAction(req,res){
    //EmployeeService.
  const userID = req.session.user.username;
  try{
    const User = await UserService.getUserById(userID);
    if (!User){
      throw new Errors.BadRequest('An Error Occurred in the Database');
    }

    res.render('admin_dashboard',
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

function listLoansforApprovalAction(req,res){
    // a list of bank loans that that require approval
}

function approveLoanAction(req,res){
    //approve a specific bank loan action.
}

function viewTotalTransactionReportAction(req,res){
    //view the total branchwise transaction report for this month
}

function viewLateLoanInstallementReportAction(req,res){
    //view the total branchwise late loan installment report
}

module.exports.init = init;