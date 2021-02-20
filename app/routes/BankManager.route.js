const Errors = require('../../common/error');
const EmployeeModel = require('../models/Employee.model');
const LoanModel = require('../models/Loan.model');
const BranchModel = require('../models/Branch.model');
const CustomerModel = require('../models/Customer.model');
const OrganizationModel = require('../models/Organization.model');
const UserModel = require('../models/User.model');
const DropdownService = require('../services/Dropdown.service');
const AccountModel = require('../models/Account.model');
const { stdLoanApprovalInfo } = require('../schema/BankManager')

function init(router) {
    router.route('/BankManager/:id')
        .get(indexAction)
    router.route('/BankManager/:id/ApproveLoan')
        .get(ApproveLoanPage)
    router.route('/BankManager/:id/LoanDetails/:loan_id')
        .get(LoanDetailsPage)
        .post(ApproveLoan)
  }



async function ApproveLoan(req,res){
    // a list of bank loans that that require approval
    try{
        const { value, error } = await stdLoanApprovalInfo.validate(req.body);
        if(error) throw error;

        const loan = await  LoanModel.getLoanDetails(req.params.loan_id);


    }catch (e) {

    }
}


async function LoanDetailsPage(req,res){
    try{
        const loan = await  LoanModel.getLoanDetails(req.params.loan_id);
        console.log(loan);
        const loan_plan = await DropdownService.getLoanPlanById(loan.loan_plan_id);
        console.log(loan_plan);
        const cus_user = await UserModel.getUserByID(loan.customer_id);
        console.log(cus_user)
        const owner_type = await AccountModel.getAccountType(loan.customer_id);
        if(owner_type.owner_type == 'U'){
            const customer = await CustomerModel.getCustomerDetailsById(loan.customer_id);
            console.log(customer)
            res.render('bm_loan_details_individual',{
                error:req.query.error,
                success:req.query.success,
                user:req.session.user,
                loan:loan,
                loan_plan:loan_plan,
                cus_user:cus_user,
                customer:customer,
            });
        }else {
            const organization = await OrganizationModel.getOrgDetails(loan.customer_id);
            console.log(organization)
            res.render('bm_loan_details_organization',{
                error:req.query.error,
                success:req.query.success,
                user:req.session.user,
                loan:loan,
                loan_plan:loan_plan,
                cus_user:cus_user,
                org:organization,
            });
        }
    }catch(e)
    {
        res.redirect(`/BankManager/${req.params.id}/ApproveLoan?error=${e}`)
    }
}


async function indexAction(req,res){
    //EmployeeService.
  try{
    const userID = req.session.user.user_id;
    let Emp = await EmployeeModel.getEmpDetailsByID(userID);
    // console.log(Emp);
    const bm_branch = await BranchModel.branchDetailsOfManager(userID);
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

    const userID = req.session.user.user_id;
    let Emp = await EmployeeModel.getEmpDetailsByID(userID);
    // console.log(Emp);
    const bm_branch = await BranchModel.branchDetailsOfManager(userID);
    if (!Emp){
        throw new Errors.BadRequest('An Error Occurred in the Database');
    }

    Emp = {
        ...Emp,
        ...req.session.user
    }

    const loans = await LoanModel.getLoanForApproval(bm_branch.branch_id);

    for (const value of loans) {
        value['url'] = `/BankManager/${userID}/LoanDetails/${value.loan_id}`
        const owner_type = await AccountModel.getAccountType(value.customer_id);
        if(owner_type.owner_type=="U"){
            value['acc_type'] = "Individual"
        }else {
            value['acc_type'] = "Organization"
        }

    }

    console.log(loans);

    // a list of bank loans that that require approval
    res.render('bm_loan_approval',{
        error:req.query.error,
        success:req.query.success,
        user:Emp,
        bm_branch:bm_branch.branch_name,
        loans:loans,
    });
}





module.exports.init = init;