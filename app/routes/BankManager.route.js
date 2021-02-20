const BankManagerService = require('../services/BankManager.service');
const UserService = require('../services/user.service');
const Errors = require('../../common/error');
const EmployeeModel = require('../models/Employee.model');
const LoanModel = require('../models/Loan.model');
const BranchModel = require('../models/Branch.model');
const DropdownService = require('../services/Dropdown.service');

function init(router) {
    router.route('/BankManager/:id')
        .get(indexAction)
    router.route('/BankManager/:id/ApproveLoan')
        .get(ApproveLoanPage)
        .post(ApproveLoan)
  }

async function indexAction(req,res){
    //EmployeeService.
  try{
    const userID = req.session.user.user_id;
    let Emp = await EmployeeModel.getEmpDetailsByID(userID);
    // console.log(Emp);
    const bm_branch = await BranchModel.branchDetailsOfManager(userID);
    console.log(bm_branch);
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
        user:Emp,
        bm_branch:bm_branch.branch_name,

      }
    )
  }catch (e){
      console.log(e)
    res.redirect(`/?error=${e}`);
  }
}



async function ApproveLoanPage(req,res){
    // a list of bank loans that that require approval
}

async function ApproveLoan(req,res){
    // a list of bank loans that that require approval
}



module.exports.init = init;