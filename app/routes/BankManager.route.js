const Errors = require('../../common/error');
const EmployeeModel = require('../models/Employee.model');
const LoanModel = require('../models/Loan.model');
const BranchModel = require('../models/Branch.model');
const CustomerModel = require('../models/Customer.model');
const OrganizationModel = require('../models/Organization.model');
const UserModel = require('../models/User.model');
const DropdownService = require('../services/Dropdown.service');
const AccountModel = require('../models/Account.model');
const ReportModel = require('../models/Report.model');
const { stdLoanApprovalInfo, TransactionReportInfo } = require('../schema/BankManager');
const  { ymd } = require('../../common/dateFormat');
const { ObjectToList } = require('../../common/helpers');

function init(router) {
    router.route('/BankManager/:id')
        .get(indexAction)
    router.route('/BankManager/:id/ApproveLoan')
        .get(ApproveLoanPage)
    router.route('/BankManager/:id/LoanDetails/:loan_id')
        .get(LoanDetailsPage)
        .post(ApproveLoan)
    router.route('/BankManager/:id/TransactionReport')
        .post(TransactionReport)
    router.route('/BankManager/:id/LateLoanReport')
        .get(LateLoanReport)
  }

async function LateLoanReport(req,res){
    try {
        const userID = req.session.user.user_id;
        let Emp = await EmployeeModel.getEmpDetailsByID(userID);
        // console.log(Emp);
        const bm_branch = await BranchModel.branchDetailsOfManager(userID);
        if (!Emp){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        let dates = {
            start_date: '1800-01-02',
            end_date: ymd(new Date()),
        }

        // dates = ObjectToList(value);
        dates = ObjectToList(dates);
        console.log(dates)
        const loan_payments = await ReportModel.getAllLoanPayments(dates);
        console.log(loan_payments);
        const unpaid = await ReportModel.getUnpaidLoan();

        let combined=[];
        for (let num=0;num<unpaid.length;num++){
            let loan_plan = await DropdownService.getLoanPlanById(unpaid[num].loan_plan_id);
            combined.push({
                ...unpaid[num],
                ...loan_plan,
            });
        }
        console.log(combined);


        res.render('bm_late_loan_report',{
            bm_branch:bm_branch,
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            start_date:dates[0],
            end_date:dates[1],
            unpaid:combined,
            loan_payments,
        })

    }catch (e) {
        res.redirect(`/BankManager/${req.params.id}?error=${e}`)
    }
}

async function TransactionReport(req,res){
    try {
        const userID = req.session.user.user_id;
        let Emp = await EmployeeModel.getEmpDetailsByID(userID);
        // console.log(Emp);
        const bm_branch = await BranchModel.branchDetailsOfManager(userID);
        if (!Emp){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        const {value,error} = await TransactionReportInfo.validate(req.body);
        if(error) throw error;

        let dates = {
            start_date: ymd(new Date(value.start_date.toString().split(' ').slice(1,4).join(' '))),
            end_date: ymd(new Date(value.end_date.toString().split(' ').slice(1,4).join(' '))),
        }

        // dates = ObjectToList(value);
        dates = ObjectToList(dates);
        console.log(dates)
        const deposits = await ReportModel.getAllDeposits(dates);
        console.log(deposits);
        const withdrawal = await ReportModel.getAllWithdraws(dates);
        console.log(withdrawal);
        const transfer = await ReportModel.getAllTransfers(dates);
        console.log(transfer);
        const loan_payments = await ReportModel.getAllLoanPayments(dates);
        console.log(loan_payments);
        console.log(value);


        res.render('bm_transaction_report',{
            bm_branch:bm_branch,
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            start_date:dates[0],
            end_date:dates[1],
            deposits,
            withdrawal,
            transfer,
            loan_payments,
        })

    }catch (e) {
        res.redirect(`/BankManager/${req.params.id}?error=${e}`)
    }
}

async function ApproveLoan(req,res){
    // a list of bank loans that that require approval
    try{
        const { value, error } = await stdLoanApprovalInfo.validate(req.body);
        if(error) throw error;

        const loan = await  LoanModel.getLoanDetails(req.params.loan_id);
        if(!loan) throw new Errors.InternalServerError("Something went wrong")

        if(req.body.approval === "accept"){
            await LoanModel.acceptStdLoan([req.params.loan_id,1]).then(()=>{
                res.redirect(`/BankManager/${req.params.id}/ApproveLoan?success=Successfully accepted loan`)
                }).catch((err)=>{
                    console.log(err);
                res.redirect(`/BankManager/${req.params.id}/ApproveLoan?error=${err}`)
            });
        }else {
            await LoanModel.acceptStdLoan([req.params.loan_id,0]).then(()=>{
                res.redirect(`/BankManager/${req.params.id}/ApproveLoan?success=Successfully Rejected loan`)
            }).catch((err)=>{
                console.log(err);
                res.redirect(`/BankManager/${req.params.id}/ApproveLoan?error=${err}`)
            });
        }
    }catch (e) {
        res.redirect(`/BankManager/${req.params.id}/ApproveLoan?error=${e}`)
    }
}


async function LoanDetailsPage(req,res){
    try{
        const loan = await  LoanModel.getLoansDetailsByID(req.params.loan_id);
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