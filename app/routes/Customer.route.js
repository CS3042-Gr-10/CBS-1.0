const ifLoggedIn = require('./../Middleware/ifLoggedIn');
const Errors = require('./../../common/error');
const ifCustomer = require('./../Middleware/ifCustomer');
const CustomerModel = require('../models/Customer.model');
const UserModel = require('../models/User.model');
const AccountModel = require('../models/Account.model');
const TransactionModel = require('../models/Transaction.model');
const OrganizationModel = require('../models/Organization.model');
const ReportModel = require('../models/Report.model');
const LoanModel = require('../models/Loan.model');
const FixedDepositModel = require('../models/FixedDeposit.model');
const BranchModel = require('../models/Branch.model');
const UserServices = require('../services/user.service');
const DropdownService = require('../services/Dropdown.service');
const EmployeeModel = require('../models/Employee.model');
const {startFDInfo, transferInfo, onlineLoanOrganizationInfo,onlineLoanIndividualInfo} = require('../schema/Customer');
const FixedDeposits = require('../models/FixedDeposit.model');
const { ObjectToList, checkOnlineFDAmount } = require('../../common/helpers');


/*const { EmployeeRegistrationInfo, CustomerRegistrationSavingsInfo, CustomerRegistrationGeneralInfo, ExistingCustomerAccountInfo } = require('../schema/Registration');
const { usernameInfo, nicInfo} = require('../schema/Authentication');
const { TransactionInfo, accountNumberInfo, customerLoanInfo, organizationLoanInfo } = require('../schema/Employee');
//const Errors = require('../../common/error');
//const DropdownService = require('../services/Dropdown.service');
//const { ObjectToList, hash_password } = require('../../common/helpers');
//const EmployeeModel = require('../models/Employee.model');
//const CustomerModel = require('../models/Customer.model');
const sendMail = require('../../common/Emailer/send_mail');
//const UserModel = require('../models/User.model');
//const AccountModel = require('../models/Account.model');
//const TransactionModel = require('../models/Transaction.model');
//const OrganizationModel = require('../models/Organization.model');
//const LoanModel = require('../models/Loan.model');
const { gen_random_string } = require('../../common/token_generator');
const  { ymd } = require('../../common/dateFormat');
const { check_ageRange } = require('../enums/savings_account_plan_age');*/

function init(router) {
    router.use('/Customer', ifLoggedIn)
    router.use('/Customer', ifCustomer)
    router.route('/Customer/:id')
        .get(indexAction);
    //router.route("/Customer/:id/customerDetails")
       // .get(checkCustomerDetails)
    router.route('/Customer/:id/startFD')
        .get(startFDPage)
        .post(startFDAction)
    router.route('/Customer/:id/transfer')
        .post(transfer)
    router.route('/Customer/:id/checkProfile')
        .get(checkProfilePage)
    router.route('/Customer/:id/account/:acc_id')
        .get(checkAccount)
    router.route('/Customer/:id/fds')
        .get(listFDsAction)
    router.route('/Customer/:id/fds/:fd_id')
        .get(checkAFD)
    router.route('/Customer/:id/loans')
        .get(listLoans)
    router.route('/Customer/:id/loans/:loan_id')
        .get(checkALoan)
    router.route('/Customer/:id/addLoan')
        .get(onlineLoanPage)
        .post(onlineLoan)
}

async function checkALoan(req,res){
    console.log(req.params.loan_id);
    const Loan = await  LoanModel.getLoansDetailsByID(req.params.loan_id);
    console.log(Loan);
    let status_message;

    if(Loan.loan_type == "ONLINE"){
        if (Loan.state === 'NOT-PAID'){
            status_message = "The Loan is yet to be payed this month"
        } else if (Loan.state == "COMPLETE"){
            status_message = "The Loan iS paid off"
        }else {
            status_message = "The Loan is payed for this month"
        }

    }else{
        if (Loan.state === 'NOT-PAID'){
            status_message = "The Loan is yet to be payed this month"
        } else if (Loan.state == "COMPLETE"){
            status_message = "The Loan iS paid off"
        }else if (Loan.state == "PENDING"){
            status_message = "The Loan is yet to be Approved by the Bank Manger"
        }else if (Loan.state == "REJECTED"){
            status_message = "The Loan is Rejected by the Bank Manger"
        }else {
            status_message = "The Loan is payed for this month"
        }
    }

    res.render('customer_single_loan_check',{
        error:req.query.error,
        success:req.query.success,
        user:req.session.user,
        Loan,
        status_message,
    })
}

async function listLoans(req,res){
    const Loans = await LoanModel.getLoansByUserID(req.session.user.user_id);

    console.log(Loans);

    Loans.forEach((value) => {
        value.url = `/Customer/${req.session.user.user_id}/loans/${value.loan_id}`
    });



    const owner_type = await AccountModel.getAccountType(req.session.user.user_id);
    let name;
    if (owner_type.owner_type === "U") {
        const customer = await CustomerModel.getCustomerDetailsById(req.session.user.user_id);
        name = `${customer.first_name} ${customer.last_name}`;
    }else {
        const organization =  await OrganizationModel.getOrgDetails(req.session.user.user_id);
        name = organization.name;
    }

    res.render('customer_check_loans',{
        error:req.query.error,
        success:req.query.success,
        user:req.session.user,
        name,
        Loans,
    });
}


async function onlineLoan(req,res){
    try{
        console.log(req.body);
        const owner_type = await AccountModel.getAccountType(req.session.user.user_id);
        if (owner_type.owner_type === "U"){
            const {value,error} = await onlineLoanIndividualInfo.validate(req.body);
            if(error) throw error;

            const FDdetails = await FixedDeposits.getFDDetailsByID(value.fd_acc);
            console.log(FDdetails);

            const check = checkOnlineFDAmount(parseFloat(value.amount),FDdetails.balance);

            console.log(check)
            if (! check.possibility){
                throw new Errors.Forbidden(`The amount is too larger than the allowed amount of ${check.max}`)
            }

            let onlineLoan = {
                customer_id_d:req.session.user.user_id,
                loaned_amount_d:parseFloat(value.amount),
                loan_plan_id_d:parseInt(value.loan_plan),
                fd_acc_d:parseInt(value.fd_acc),
            }

            onlineLoan = ObjectToList(onlineLoan)

            await LoanModel.addOnlineLoan(onlineLoan).then((data)=>{
                console.log(data)
                if(data.result === 0){
                    throw new Errors.Conflict("Internal Server Error");
                }else if(data.result === 1){
                    res.redirect(`/Customer/${req.session.user.user_id}?success=Successfully acquired Loan`)
                }else if(data.result === 2){
                    throw new Errors.Forbidden(`The amount is too larger than the allowed amount of ${check.max}`);
                }else if(data.result === 3){
                    throw new Errors.Forbidden(`The amount is too larger than the allowed amount of ${check.max}`);
                }else{
                    console.log(data);
                    throw new Errors.InternalServerError(`Error in DataBase`);
                }
            }).catch((e)=>{
                console.log(e);
                res.redirect(`/Customer/${req.session.user.user_id}?error=${e}`)
            })

        }else{
            const {value,error} = await onlineLoanOrganizationInfo.validate(req.body);
            if(error) throw error;

            const FDdetails = await FixedDeposits.getFDDetailsByID(value.fd_acc);
            console.log(FDdetails);

            const check = checkOnlineFDAmount(parseFloat(value.amount),FDdetails.balance);

            console.log(check)
            if (! check.possibility){
                throw new Errors.Forbidden(`The amount is too larger than the allowed amount of ${check.max}`)
            }

            let onlineLoan = {
                customer_id_d:req.session.user.user_id,
                loaned_amount_d:parseFloat(value.amount),
                loan_plan_id_d:parseInt(value.loan_plan),
                fd_acc_d:parseInt(value.fd_acc),
            }

            onlineLoan = ObjectToList(onlineLoan)

            await LoanModel.addOnlineLoan(onlineLoan).then((data)=>{
                console.log(data)
                if(data.result === 0){
                    throw new Errors.Conflict("Internal Server Error");
                }else if(data.result === 1){
                    res.redirect(`/Customer/${req.session.user.user_id}?success=Successfully acquired Loan`)
                }else if(data.result === 2){
                    throw new Errors.Forbidden(`The amount is too larger than the allowed amount of ${check.max}`);
                }else if(data.result === 3){
                    throw new Errors.Forbidden(`The amount is too larger than the allowed amount of ${check.max}`);
                }else{
                    console.log(data);
                    throw new Errors.InternalServerError(`Error in DataBase`);
                }
            }).catch((e)=>{
                console.log(e);
                res.redirect(`/Customer/${req.session.user.user_id}?error=${e}`)
            })
        }
    }catch(e) {
        console.log(e);
        res.redirect(`/Customer/${req.session.user.user_id}?error=${e}`)
    }
}

async function onlineLoanPage(req,res){
    const owner_type = await AccountModel.getAccountType(req.session.user.user_id);
    const loan_plan = await DropdownService.getLoanPlans();
    const FDs = await FixedDeposits.getFDByUserID(req.session.user.user_id);
    console.log(FDs);

    if (owner_type.owner_type === "U"){
        const customer = await CustomerModel.getCustomerDetailsById(req.session.user.user_id);
        res.render('customer_individual_new_loan',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            nic:customer.NIC,
            amount:req.query.amount,
            loan_plan:loan_plan,
            FDs,
        });
    }else {
        const organization = await OrganizationModel.getOrgDetails(req.session.user.user_id);
        res.render('customer_new_loan_organization',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            org_id:organization.reg_number,
            amount:req.query.amount,
            loan_plan:loan_plan,
            FDs,
        });
    }
}


async function checkAFD(req,res){
    const FD = await  FixedDeposits.getFDDetailsByID(req.params.fd_id);
    const branch = await BranchModel.branchDetails(FD.branch_id);
    console.log(FD);
    console.log(branch);
    res.render('customer_single_fd_check',{
        error:req.query.error,
        success:req.query.success,
        user:req.session.user,
        FD,
        branch,
    })
}
async function indexAction(req,res){
    //EmployeeService.
    try{
        console.log(req.session.user)
        const userID = req.session.user.user_id;
        let owner_type = await AccountModel.getAccountType(userID);
        //console.log(owner_type)
        let Cus;

        if (owner_type.owner_type === "U"){
            Cus = await CustomerModel.getCustomerDetailsById(userID);
        }else{
            Cus = await OrganizationModel.getOrgDetails(userID);
        }

        if(owner_type.owner_type ==="U"){
            owner_type = "Individual"
        }else{
            owner_type = "Organization"
        }


        // console.log(Emp);
        if (!Cus){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        Cus = {
            ...Cus,
            ...req.session.user,
            owner_type,
        }

        const savings_acc = await DropdownService.getSavingsAccountsOfUser(userID);
        if (savings_acc.length === 0) throw new Errors.Conflict("Visit your local bank and first make a Bank Account")
        console.log(savings_acc)


        console.log(Cus);
        res.render('customer_dashboard',
          {
              url_params: req.params,
              error:req.query.error,
              success:req.query.success,
              User:Cus,
              savings_acc
          }
        )
    }catch (e){
        res.redirect(`/?error=${e}`);
    }
}

async function startFDPage(req,res){
    //starting an fd by customer to page.
    console.log(req.query)
    const fd_plan = await DropdownService.getFDPlans();

    res.render('fd_application_form',{
        error:req.query.error,
        success:req.query.success,
        user:req.session.user,
        saving_no:req.query.savings_no,
        fd_plan
    })

}

async function startFDAction(req, res) {
    // to create FD
    try {
        const {value, error} = await startFDInfo.validate(req.body);
        if (error) throw error;
        console.log(value);
        if(!(value.username === req.session.user.username)){
            throw new Errors.Unauthorized("Wrong username")
        }
        const account = await AccountModel.getAccount(value.saving_no)
        console.log(account);

        let fd = {
            cusotmer_id:parseInt(req.session.user.user_id),
            acc_plan_id:parseInt(value.fd_plan),
            sv_acc_id:parseInt(value.saving_no),
            branch_id:parseInt(account.branch_id),
            balance:parseFloat(value.amount),
        }

        console.log(fd);
        fd = ObjectToList(fd);


        await FixedDeposits.addCFixedDeposit(fd).then((data)=>{
            console.log(data)
            res.redirect(`/Customer/${req.params.id}?success=added Fixed Deposits`)
        }).catch((err)=>{
            throw err;
        })


    } catch (e) {
        console.log(e)
        res.redirect(`/Customer/${req.params.id}?error=${e}`)
    }
}

async function transfer(req,res){
    //transfering funds between accounts
    try {
        console.log('here');
        const {value, error} = await transferInfo.validate(req.body);
        if (error) throw error;
        if(value.receiving_acc_no === value.savings_no){
            throw new Errors.Forbidden("Can't transfer to the same account")
        }
        const receiver = await AccountModel.getAccount(value.receiving_acc_no)
        if(!receiver) throw new Errors.NotFound("No Such account to transfer");
        if(receiver.acc_type === "CURRENT") throw  new Errors.Forbidden("Can't transfer to Current account");
        console.log(value);

        let transfer = {
            user_id_d:req.session.user.user_id,
            amount_d:value.amount,
            from_acc_d:value.savings_no,
            to_acc_d:value.receiving_acc_no,
        }

        transfer = ObjectToList(transfer);

        await AccountModel.transferMoney(transfer).then((data)=>{
            console.log(data);
            if(data.result === 1){
                console.log(`transfer from ${transfer[2]} to ${transfer[3]} Successful`);
                res.redirect(`/Customer/${req.params.id}?success=Transfer from ${transfer[2]} to ${transfer[3]} Successful`)
            }else if(data.result === 0){
                throw new Errors.Unauthorized("Not enough balance")
            }else{
                throw new Errors.Unauthorized("Entered Negative amount")
            }
        }).catch((error)=>{
            throw error;
        })

    }catch (e) {
        console.log(e)
        res.redirect(`/Customer/${req.params.id}?error=${e}`)
    }
}

async function checkProfilePage(req,res){
    const owner_type = await AccountModel.getAccountType(req.session.user.user_id);
    const accounts = await  AccountModel.getCustomerAccDetail(req.session.user.user_id);

    accounts.forEach(value =>{
        value.url = `/Customer/${req.session.user.user_id}/account/${value.acc_id}`;
    });

    if (owner_type.owner_type === "U"){
        const customer = await CustomerModel.getCustomerDetailsById(req.session.user.user_id);

        console.log(accounts);
        console.log(customer);
        console.log(req.session.user);
        res.render('customer_individual_profile_check',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            accounts:accounts,
            customer:customer,
        });
    }else {
        // console.log(req.session.user);
        const organization =  await OrganizationModel.getOrgDetails(req.session.user.user_id);
        console.log(accounts);
        console.log(organization);
        console.log(req.session.user);
        res.render('customer_organization_profile_check',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            accounts:accounts,
            org:organization,
        });
    }
}

async function checkAccount(req,res) {
    //check details of a single account (savings account , checking account)
    try{
        const account = await AccountModel.getAccount(req.params.acc_id);
        console.log(account);
        const branch = await BranchModel.branchDetails(account.branch_id)
        console.log(branch)
        const deposits = await ReportModel.getDepositByAccId(req.params.acc_id,10);
        console.log(deposits);
        const withdrawals = await ReportModel.getWithdrawByAccId(req.params.acc_id,10);
        console.log(withdrawals);
        const transfers = await ReportModel.getTransferByAccId(req.params.acc_id,10);
        console.log(transfers);

        res.render('customer_account_check',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            account,
            deposits,
            withdrawals,
            transfers,
            branch,
        })
    }catch (e) {
        console.log(e)
        res.redirect(`/Customer/${req.session.user.user_id}?error=${e}`)
    }



}

async function listFDsAction(req,res){
    //list of the the fd and their details.

    const FDs = await FixedDeposits.getFDByUserID(req.session.user.user_id);

    console.log(FDs);

    FDs.forEach((value) => {
       value.url = `/Customer/${req.session.user.user_id}/fds/${value.fd_id}`
    });



    const owner_type = await AccountModel.getAccountType(req.session.user.user_id);
    let name;
    if (owner_type.owner_type === "U") {
        const customer = await CustomerModel.getCustomerDetailsById(req.session.user.user_id);
        name = `${customer.first_name} ${customer.last_name}`;
    }else {
        const organization =  await OrganizationModel.getOrgDetails(req.session.user.user_id);
        name = organization.name;
    }

    res.render('customer_check_fds',{
        error:req.query.error,
        success:req.query.success,
        user:req.session.user,
        name,
        FDs,
    });

}


async function checkProfilePage(req,res){
    const owner_type = await AccountModel.getAccountType(req.session.user.user_id);
    const accounts = await  AccountModel.getCustomerAccDetail(req.session.user.user_id);

    accounts.forEach(value =>{
        value.url = `/Customer/${req.session.user.user_id}/account/${value.acc_id}`;
    });

    if (owner_type.owner_type === "U"){
        const Customer = await CustomerModel.getCustomerDetailsById(req.session.user.user_id);

        console.log(accounts);
        console.log(Customer);
        console.log({
            error: req.session.user.error,
            user: req.session.user,
            full_name:`${Customer.first_name} ${Customer.last_name}`,
            NIC_number:Customer.NIC,
            gender:Customer.gender,
            address:`${Customer.house_no} , ${Customer.street} , ${Customer.city}`,
            postal_code:Customer.postal_code,
            contact_No1:Customer.contact_primary,
            contact_No2:Customer.contact_secondary,
            email:Customer.email,
            dob:Customer.dob,
            open_date:accounts.created_date,

           // deposits:deposits,
           // withdrawals:withdrawals,


        });
        console.log(req.session.user);
        res.render('customer_individual_profile_check',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            accounts:accounts,
           // customer:customer,
           full_name:`${Customer.first_name} ${Customer.last_name}`,

            NIC_number:Customer.NIC,
            gender:Customer.gender,
            address:`${Customer.house_no} , ${Customer.street} , ${Customer.city}`,
            postal_code:Customer.postal_code,
            contact_No1:Customer.contact_primary,
            contact_No2:Customer.contact_secondary,
            email:Customer.email,
            dob:Customer.dob,
            open_date:accounts.created_date,

        });
    }else {
        // console.log(req.session.user);
        const organization =  await OrganizationModel.getOrgDetails(req.session.user.user_id);
        console.log(accounts);
        console.log(organization);
        console.log({
            error: req.session.user.error,
            user: req.session.user,
            reg_No:organization.reg_number,
            address:`${organization.house_no} , ${organization.street} , ${organization.city}`,
            postal_code:organization.postal_code,
            contact_No:organization.contact_No,
            email:organization.email,
            open_date:organization.created_date,

           // deposits:deposits,
           // withdrawals:withdrawals,


        });
        console.log(req.session.user);
        res.render('customer_organization_profile_check',{
            error:req.query.error,
            success:req.query.success,
            user:req.session.user,
            reg_No:organization.reg_number,
            address:`${organization.house_no} , ${organization.street} , ${organization.city}`,
            postal_code:organization.postal_code,
            contact_No:organization.contact_No,
            email:organization.email,
            open_date:organization.created_date,
            accounts:accounts,
            //org:organization,
        });
    }
}

module.exports.init = init;