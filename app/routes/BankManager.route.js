const BankManagerService = require('../services/BankManager.service');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const error_type = require('../../common/error-type');
const UserService = require('../services/user.service');
const Errors = require('../../common/error');
const GeneralError = error_type.RedirectGeneralError;
const EmployeeModel = require('../models/Employee.model');
const DropdownService = require('../services/Dropdown.service');

function init(router) {
    router.route('/BankManager')
        .get(GeneralError)
    router.route('/BankManager/:id')
        .get(indexAction)
    router.route('/BankManager/ApproveLoan')
      .get()
  }

async function indexAction(req,res){
    //EmployeeService.
  try{
    const userID = req.session.user.user_id;
    let Emp = await EmployeeModel.getEmpDetailsByID(userID);
    const branches = await DropdownService.getBranches();
    // console.log(Emp);
    if (!Emp){
      throw new Errors.BadRequest('An Error Occurred in the Database');
    }

    Emp = {
      ...Emp,
      ...req.session.user
    }

    // console.log(Emp);
    res.render('bm_dashboard',
      {
        url_params: req.params,
        error:req.query.error,
        success:req.query.success,
        User:Emp,
        branches:branches,

      }
    )
  }catch (e){
    res.redirect(`/?error=${e}`);
  }
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