const { EmployeeRegistrationInfo, CustomerRegistrationGeneralInfo,OrganizationRegistrationGeneralInfo } = require('../schema/Registration');
const { usernameInfo, nicInfo} = require('../schema/Authentication');
const { TransactionInfo, accountNumberInfo, customerLoanInfo,payLoanTnfo, organizationLoanInfo,IndividualCurrentInfo,IndividualSavingsInfo,OrganizationSavingsInfo,OrganizationCurrentInfo } = require('../schema/Employee');
const Errors = require('../../common/error');
const DropdownService = require('../services/Dropdown.service');
const { ObjectToList, hash_password } = require('../../common/helpers');
const EmployeeModel = require('../models/Employee.model');
const CustomerModel = require('../models/Customer.model');
const sendMail = require('../../common/Emailer/send_mail');
const UserModel = require('../models/User.model');
const AccountModel = require('../models/Account.model');
const TransactionModel = require('../models/Transaction.model');
const ReportModel = require('../models/Report.model');
const OrganizationModel = require('../models/Organization.model');
const LoanModel = require('../models/Loan.model');
const { gen_random_string } = require('../../common/token_generator');
const  { ymd } = require('../../common/dateFormat');
const { check_ageRange } = require('../enums/savings_account_plan_age');
const ifEmployeeCreatable = require('../Middleware/ifEmployeeCreatable');
const ifLoggedIn = require('../Middleware/ifLoggedIn');
const ifEmployee = require('../Middleware/ifEmployee');

function init(router) {
    router.get('/Employee/register',ifEmployeeCreatable,registerEmployeePage)
    router.post('/Employee/register',ifEmployeeCreatable,registerEmployeeAction);
    router.get('/Employee/:id',ifLoggedIn,ifEmployee,indexAction);
    router.get('/Employee/:id/registerCustomer',ifLoggedIn,ifEmployee,registerCustomerPage)
    router.post('/Employee/:id/registerCustomer',ifLoggedIn,ifEmployee,registerCustomer);
    router.get('/Employee/:id/registerOrganization',ifLoggedIn,ifEmployee,registerOrganizationPage)
    router.post('/Employee/:id/registerOrganization',ifLoggedIn,ifEmployee,registerOrganization);
    router.get("/Employee/:id/addAccountIndividual",ifLoggedIn,ifEmployee,addAccountIndividualPage)
    router.post("/Employee/:id/addAccountIndividual",ifLoggedIn,ifEmployee,addAccountIndividual)
    router.get("/Employee/:id/addAccountOrganization",ifLoggedIn,ifEmployee,addAccountOrganizationPage)
    router.post("/Employee/:id/addAccountOrganization",ifLoggedIn,ifEmployee,addAccountOrganization)
    router.get("/Employee/:id/AccountDetails",ifLoggedIn,ifEmployee,getCustomerDetails)
    router.get("/Employee/:id/customerTransaction",ifLoggedIn,ifEmployee,customerTransactionPage)
    router.post("/Employee/:id/customerTransaction",ifLoggedIn,ifEmployee,customerTransaction)
    router.get("/Employee/:id/customerLoan",ifLoggedIn,ifEmployee,customerLoanPage)
    router.post("/Employee/:id/customerLoan",ifLoggedIn,ifEmployee,customerLoan)
    router.get("/Employee/:id/organizationLoan",ifLoggedIn,ifEmployee,organizationLoanPage)
    router.post("/Employee/:id/organizationLoan",ifLoggedIn,ifEmployee,organizationLoan)
    router.get("/Employee/:id/payLoan",ifLoggedIn,ifEmployee,payLoanPage)
    router.post("/Employee/:id/payLoan",ifLoggedIn,ifEmployee,payLoan)
}

async function payLoan(req,res){
    try{
        console.log(req.body)
        let { value, error } = await payLoanTnfo.validate(req.body);
        if (error) throw (error);

        await LoanModel.addMonthlyPay(req.body.loan_id).then(
            res.redirect(`/Employee/${req.session.user.user_id}?success=Monthly payment to loan ${req.body.loan_id} Successfully`)
        ).catch((e)=>{
            console.log(e);
            res.redirect(`/Employee/${req.session.user.user_id}?error=${e}`)
        });
    }catch (e) {
        console.log(e);
        res.redirect(`/Employee/${req.session.user.user_id}?error=${e}`)
    }
}

async function payLoanPage(req,res){
    try{
        let { value, error } = await payLoanTnfo.validate(req.query);
        if (error) throw (error);

        const loan = await new LoanModel.getLoansDetailsByID(req.query.loan_id);
        if (!loan) throw new Errors.NotFound("No such Loan");
        console.log(loan);

        let monthly_amount = ((loan.interrest_rate+1)*loan.loaned_amount)/loan.period ;
        monthly_amount = monthly_amount.toFixed(2);
        console.log(monthly_amount);

        let show;
        let completed;
        if(loan.state === 'NOT-PAID'){
            show = true;
            completed = false;
        }else if (loan.state === 'PAID'){
            show = false;
            completed = 'Already paid for this month'
        }else {
            show = false
            completed = "Loan Payment Completed"
        }

        res.render('employee_loan_pay',{
            error: req.query.error,
            success:req.query.success,
            user: req.session.user,
            Loan:loan,
            monthly_amount,
            show,
            completed,
        });

    }catch (e) {
        console.log(e);
        res.redirect(`/Employee/${req.session.user.user_id}?error=${e}`)
    }
}

async function indexAction(req,res){
    //console.log(req.session.user);
    try{
        const userID = req.session.user.user_id;
        let Emp = await EmployeeModel.getEmpDetailsByID(userID);
        // console.log(Emp);
        if (!Emp){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        console.log(req.session.user);
        Emp = {
            ...Emp,
            ...req.session.user
        }

        // console.log(Emp);
        res.render('employee_dashboard',
          {
              url_params: req.params,
              error:req.query.error,
              success:req.query.success,
              User:Emp

          }
        )
    }catch (e){
        res.redirect(`/?error=${e}`);
    }

}

async function registerOrganizationPage(req,res){
    const branches = await DropdownService.getBranches();
    const savings_plan = await DropdownService.getSavingAccPlans();

    res.render('reg_org', {
        org_name:req.query.org_name,
        org_id:req.query.org_id,
        reg_date:req.query.reg_date,
        add_no:req.query.add_no,
        add_street:req.query.add_street,
        add_city:req.query.add_city,
        postal_code:req.query.postal_code,
        contact:req.query.contact,
        email:req.query.email,
        error: req.query.error,
        user: req.session.user,
        branches:branches,
        savings_plan:savings_plan,
    });

}

async function registerOrganization(req,res){
    try{
        console.log(req.body);

        let { value, error } = await OrganizationRegistrationGeneralInfo.validate(req.body);
        if (error) throw (error);

        console.log(value);

        let userAlreadyExist = await UserModel.getUserByEmail(value.email);
        if (userAlreadyExist) throw ("Already Registered by this email");

        userAlreadyExist = await OrganizationModel.getOrgDetailsByRegNo(value.org_id);
        if (userAlreadyExist) throw ("Already Registered by this Registration Number");


        const username = gen_random_string();
        const password = gen_random_string();

        let acc = {
            username: username,
            password:await hash_password(password),
            org_name:value.org_name,
            email:value.email,
            contact_no:parseInt(value.contact.split("-").join('')),
            branch:value.branch,
            reg_no:value.org_id,
            house_no:value.add_no,
            street:value.add_street,
            city:value.add_city,
            postal_code:value.postal_code,
        }
        console.log(username);


        await sendUserDetailsMail({
            email:acc.email,
            username:username,
            password:password,
        });

        acc = ObjectToList(acc);
        // console.log(acc);




        await OrganizationModel.addOrg(acc).then((data)=>{
            console.log(data)
            console.log("Customer Added")
            return;
        }).catch((err)=>{
            console.log('error adding employee')
            throw (err);
        })
        res.redirect(`/employee/${req.params.id}/addAccountOrganization?org_id=${value.org_id}`)

    }catch (e) {
        res.redirect(`/employee/${req.params.id}/registerOrganization?error=${e}&org_name=${req.body.org_name}&org_id=${req.body.org_id}&reg_date=${req.body.reg_date}&add_no=${req.body.add_no}&add_street=${req.body.add_street}&add_city=${req.body.add_city}&postal_code=${req.body.postal_code}&contact=${req.body.contact}&email=${req.body.email}`);
    }
}

async function addAccountIndividualPage(req,res){
    const branches = await DropdownService.getBranches();
    const savings_plan = await DropdownService.getSavingAccPlans();
    res.render('create_individual_acc',{
        nic: req.query.nic,
        init_amount:req.query.init_amount,
        error: req.query.error,
        user: req.session.user,
        branches:branches,
        savings_plan:savings_plan,
    });
}

async function addAccountIndividual(req,res){
    try{
        if (req.body.acc_type === 'savings'){
            console.log(req.body)
            const {value,error} = await IndividualSavingsInfo.validate(req.body);
            if (error) throw (error);

            const user = await CustomerModel.getCustomerDetailsByNIC(req.body.nic);
            console.log(user)
            let savings = {
                branch_id:parseInt(req.body.branch),
                acc_balance:parseFloat(req.body.init_amount),
                usr_id:user.user_id,
                account_plan_id:parseInt(req.body.savings_plan),
            }

            console.log(savings);

            savings = ObjectToList(savings);
            console.log(savings);

            await AccountModel.addSavingAccount(savings).then((data)=>{
                console.log(data);
                if(data.result === 0){
                    console.log('Savings account added');
                    res.redirect(`/employee/${req.params.id}?success=Savings account added`)
                }else if(data.result === 2){
                    throw new Errors.Unauthorized("Age range doesnt map with selected plan")
                }else{
                    throw new Errors.Unauthorized("Not enough balance")
                }
            }).catch((err)=>{
                console.log(err);
                throw (err);
            })
        }else {
            const {value,error} = await IndividualCurrentInfo.validate({
                nic:req.body.nic,
                acc_type:req.body.acc_type,
                init_amount:req.body.init_amount,
                branch:req.body.branch,
                agree_check:req.body.agree_check
            });
            if (error) throw (error);

            const user = await CustomerModel.getCustomerDetailsByNIC(req.body.nic);
            //console.log('Not Here');
            let current ={
                branch_id: parseInt(req.body.branch) ,
                acc_balance: parseFloat(req.body.init_amount),
                usr_id: user.user_id,
            }

            console.log(current);
            current = ObjectToList(current);

            await AccountModel.addCurrentAccount(current).then(()=>{
                console.log('Current account added');
                res.redirect(`/employee/${req.params.id}?success=Current account made`)
            }).catch((err)=>{
                console.log(err);
                throw (err);
            })
        }
    }catch (e) {
        console.log(e);
        res.redirect(`/employee/${req.params.id}/addAccountIndividual?error=${e}&nic=${req.body.nic}&init_amount=${req.body.init_amount}`);
    }
}

async function addAccountOrganizationPage(req,res){
    const branches = await DropdownService.getBranches();
    const savings_plan = await DropdownService.getSavingAccPlans();
    res.render('create_org_acc',{
        error: req.query.error,
        user: req.session.user,
        org_id:req.query.org_id,
        branches:branches,
        savings_plan:savings_plan,
    });
}

async function addAccountOrganization(req,res){
    try{
        if (req.body.acc_type === 'savings'){
            console.log(req.body)
            const {value,error} = await OrganizationSavingsInfo.validate(req.body);
            if (error) throw (error);

            const user = await OrganizationModel.getOrgDetailsByRegNo(req.body.org_id);
            if(!user) throw new Errors.NotFound("No such Organization")

            console.log(user)
            let savings = {
                branch_id:parseInt(req.body.branch),
                acc_balance:parseFloat(req.body.init_amount),
                usr_id:user.user_id,
                account_plan_id:parseInt(req.body.savings_plan),
            }

            console.log(savings);

            savings = ObjectToList(savings);
            console.log(savings);

            await AccountModel.addSavingAccount(savings).then((data)=>{
                console.log(data);
                if(data.result === 0){
                    console.log('Savings account added');
                    res.redirect(`/employee/${req.params.id}?success=Savings account added`)
                }else if(data.result === 2){
                    throw new Errors.Unauthorized("Age range doesnt map with selected plan")
                }else{
                    throw new Errors.Unauthorized("Not enough balance")
                }
            }).catch((err)=>{
                console.log(err);
                throw (err);
            })
        }else {
            const {value,error} = await OrganizationCurrentInfo.validate({
                org_id:req.body.org_id,
                acc_type:req.body.acc_type,
                init_amount:req.body.init_amount,
                branch:req.body.branch,
                agree_check:req.body.agree_check
            });
            if (error) throw (error);

            const user = await OrganizationModel.getOrgDetailsByRegNo(req.body.org_id);
            if(!user) throw new Errors.NotFound("No such Organization")

            console.log(user)

            let current ={
                branch_id: parseInt(req.body.branch) ,
                acc_balance: parseFloat(req.body.init_amount),
                usr_id: user.user_id,
            }

            console.log(current);
            current = ObjectToList(current);

            await AccountModel.addCurrentAccount(current).then(()=>{
                console.log('Current account added');
                res.redirect(`/employee/${req.params.id}?success=Current account made`)
            }).catch((err)=>{
                console.log(err);
                throw (err);
            })
        }
    }catch (e) {
        console.log(e);
        res.redirect(`/employee/${req.params.id}/addAccountOrganization?error=${e}&org_id=${req.body.org_id}&init_amount=${req.body.init_amount}`);
    }
}

async function  registerCustomerPage(req, res){
    const branches = await DropdownService.getBranches();
    const savings_plan = await DropdownService.getSavingAccPlans();

    res.render('reg_customer', {
        error: req.query.error,
        user: req.session.user,
        first_name:req.query.first_name,
        last_name:req.query.last_name,
        name_with_initials:req.query.name_with_initials,
        age:req.query.age,
        dob:req.query.dob,
        add_no:req.query.add_no,
        add_street:req.query.add_street,
        add_city:req.query.add_city,
        postal_code:req.query.postal_code,
        nic:req.query.nic,
        contact:req.query.contact,
        email:req.query.email,
        branches:branches,
        savings_plan:savings_plan,
    });
}

async function registerCustomer(req, res){
    try{
        const general = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            name_with_initials: req.body.name_with_initials,
            age: req.body.age,
            dob: req.body.dob,
            add_no: req.body.add_no,
            add_street: req.body.add_street,
            add_city: req.body.add_city,
            postal_code: req.body.postal_code,
            nic: req.body.nic,
            gender: req.body.gender,
            contact: req.body.contact,
            email: req.body.email,
            branch: req.body.branch,
            agree_check:req.body.agree_check
        }

        let { value, error } = await CustomerRegistrationGeneralInfo.validate(general);
        if (error) throw (error);

        console.log(value);


        let userAlreadyExist = await UserModel.getUserByEmail(value.email);
        if (userAlreadyExist) throw ("Already Registered by this email");

        userAlreadyExist = await CustomerModel.getCustomerDetailsByNIC(value.nic);
        if (userAlreadyExist) throw ("Already Registered by this nic");

        const username = gen_random_string();
        const password = gen_random_string();

        let acc = {
            usr: username,
            password:await hash_password(password),
            email:value.email,
            first_name:value.first_name,
            last_name:value.last_name,
            name_with_init:value.name_with_initials,
            dob:ymd(new Date(value.dob.toString().split(' ').slice(1,4).join(' '))),
            NIC:value.nic,
            gender:value.gender,
            house_no:value.add_no,
            street:value.add_street,
            city:value.add_city,
            postal_code:parseInt(value.postal_code),
            contact_primary:parseInt(value.contact.split("-").join('')),
            contact_secondary:parseInt(value.contact.split("-").join('')),
            acc_level:"CUSTOMER",
        }
        console.log(username);


        await sendUserDetailsMail({
            email:acc.email,
            username:username,
            password:password,
        });

        acc = ObjectToList(acc);
        // console.log(acc);




        await CustomerModel.addCustomer(acc).then((data)=>{
            console.log("Customer Added")
            return;
        }).catch((err)=>{
            console.log('error adding employee')
            throw (err);
        })

        res.redirect(`/employee/${req.params.id}/addAccountIndividual?nic=${value.nic}`)

    }catch (e) {
        res.redirect(`/employee/${req.params.id}/registerCustomer?error=${e}&first_name=${req.body.first_name}&last_name=${req.body.last_name}&name_with_initials=${req.body.name_with_initials}&age=${req.body.age}&dob=${req.body.dob}&add_no=${req.body.add_no}&add_street=${req.body.add_street}&add_city=${req.body.add_city}&postal_code=${req.body.postal_code}&nic=${req.body.nic}&contact=${req.body.contact}&username=${req.body.username}&email=${req.body.email}`);
    }
}

async function customerLoanPage(req,res){
    const branches = await DropdownService.getBranches();
    const loan_plan = await DropdownService.getLoanPlans();

    res.render('employee_new_loan',{
        error:req.query.error,
        success:req.query.success,
        user: req.session.user,
        branches:branches,
        nic:req.query.nic,
        income:req.query.income,
        amount:req.query.amount,
        loan_plan:loan_plan,
    });
}

async function customerLoan(req,res){
    try{
        const { value, error } = await customerLoanInfo.validate(req.body);
        if (error) throw (error);

        const customer = await CustomerModel.getCustomerDetailsByNIC(value.nic);
        if (!customer) throw new Errors.NotFound("Customer not found");

        const installment = (parseFloat(value.amount)*parseFloat(value.interest))/parseInt(value.time)
        // console.log(installment);
        let Loan = {
            customer_id_d: customer.user_id,
            loaned_amount_d:parseFloat(value.amount),
            loan_plan_id_d:parseInt(value.loan_plan),
            branch_id_d:parseInt(value.branch),
        }

        Loan = ObjectToList(Loan);

        await LoanModel.addStdLoan(Loan).then((data)=>{
           console.log(data)
            res.redirect(`/employee/${req.params.id}?success=Loan Successfully added`);
        }).catch((error)=>{
            console.log(error);
            throw new Errors.InternalServerError("Error while adding Loan")
        });

    }catch (err) {
        console.log(err);
        res.redirect(`/employee/${req.params.id}/customerLoan?error=${err.message}&nic=${req.body.nic}&income=${req.body.income}&amount=${req.body.amount}`)
    }
}

async function organizationLoanPage(req,res){
    const branches = await DropdownService.getBranches();
    const loan_plan = await DropdownService.getLoanPlans();

    res.render('employee_new_loan_organization',{
        error:req.query.error,
        success:req.query.success,
        user: req.session.user,
        branches:branches,
        org_id:req.query.org_id,
        income:req.query.income,
        amount:req.query.amount,
        loan_plan:loan_plan,
    });
}

async function organizationLoan(req,res){
    try{
        const { value, error } = await organizationLoanInfo.validate(req.body);
        if (error) throw (error);

        const customer = await OrganizationModel.getOrgDetailsByRegNo(value.org_id);
        if (!customer) throw new Errors.NotFound("Customer not found");

        const installment = (parseFloat(value.amount)*parseFloat(value.interest))/parseInt(value.time)

        let Loan = {
            customer_id_d: customer.user_id,
            loaned_amount_d:parseFloat(value.amount),
            loan_plan_id_d:parseInt(value.loan_plan),
            branch_id_d:parseInt(value.branch),
        }

        Loan = ObjectToList(Loan);

        await LoanModel.addStdLoan(Loan).then((data)=>{
            console.log(data)
            res.redirect(`/employee/${req.params.id}?success=Loan Successfully added`);
        }).catch((error)=>{
            console.log(error);
            throw new Errors.InternalServerError("Error while adding Loan")
        });

    }catch (err) {
        console.log(err);
        res.redirect(`/employee/${req.params.id}?error=${err.message}&org_id=${req.body.org_id}&income=${req.body.income}&amount=${req.body.amount}`)
    }
}

async function getCustomerDetails(req,res){
    try{
        const { value, error } = await accountNumberInfo.validate({
            accNum:req.query.accNum,
            customer_type:req.query.customer_type
        });
        if (error) throw (error);

        if(value.customer_type === 'customer'){
            const account = await AccountModel.getAccount(req.query.accNum);
            console.log(account);
            if(!account) throw ( new Errors.NotFound("No such Account Exists"))


            const deposits = await ReportModel.getDepositByAccId(req.query.accNum,20);
            console.log(deposits);
            const withdrawals = await ReportModel.getWithdrawByAccId(req.query.accNum,20);
            console.log(withdrawals);
            const Customer = await CustomerModel.getCustomerDetailsById(account.user);


            res.render('employee_customer_acc_details', {
                error: req.query.error,
                user: req.session.user,
                full_name:`${Customer.first_name} ${Customer.last_name}`,
                acc_number:account.acc_id,
                NIC_number:Customer.NIC,
                open_date:account.created_date,
                acc_type:account.acc_type,
                deposits:deposits,
                withdrawals:withdrawals,
            });
        }else {
            const account = await AccountModel.getAccount(req.query.accNum);
            if(!account) throw new Errors.NotFound("No such Account Exists")

            const organization = await OrganizationModel.getOrgDetails(account.user);
            if (!organization) throw new Errors.NotFound("No such Account Exists")


            const deposits = await ReportModel.getDepositByAccId(req.query.accNum,20);
            console.log(deposits)
            const withdrawals = await ReportModel.getWithdrawByAccId(req.query.accNum,20);
            console.log(withdrawals)


            res.render('employee_organization_acc_details', {
                error: req.query.error,
                user: req.session.user,
                name: organization.name,
                acc_number:account.acc_id,
                contact_No: organization.contact_No,
                open_date:account.created_date,
                acc_type:account.acc_type,
                deposits:deposits,
                withdrawals:withdrawals,
            });
        }

    }catch (e) {
        console.log(e);
        console.log(e.message);
        res.redirect(`/employee/${req.params.id}?error=${e.message}`)
    }
}

async function customerTransactionPage(req,res){
    res.render('employee_transaction',{
        error: req.query.error,
        user: req.session.user,
    });
}

async function customerTransaction(req,res){
    console.log(req.body);
    try{
        const { value, error } = await TransactionInfo.validate(req.body);
        if (error) throw (error);

        if (value.transaction_type === "withdraw"){
            let withdraw = {
               account_id:parseInt(value.accNum),
               emp_id:req.params.id,
               amount:parseFloat(value.amount),
            }

            console.log(withdraw)
            withdraw = ObjectToList(withdraw);
            console.log(withdraw)
            await AccountModel.withdrawSvAcc(withdraw).then((data)=>{
                console.log(data);
                if (data[0].result == 1){
                    res.redirect(`/employee/${req.params.id}?success=Withdrawing ${value.amount} from ${value.accNum} Savings account was Successful`)
                }else if(data[0].result == 0){
                    throw new Errors.BadRequest("Not enough account balance");
                }else if(data[0].result == 3){
                    throw new Errors.BadRequest("Entered a negative balance");
                }else {
                    throw new Errors.InternalServerError("Something went wrong")
                }

            }).catch((err)=>{
                console.log(err);
                throw (err);
            });

        }else {
            let deposit = {
                amount:parseFloat(value.amount),
                emp_id:req.params.id,
                deposit_acc_id:parseInt(value.accNum),
            }
            console.log(deposit);
            deposit = ObjectToList(deposit);
            console.log(deposit);

            await AccountModel.depositMoneySvAcc(deposit).then((data)=>{
                console.log(data);
                if (data[0].result == 1){
                    res.redirect(`/employee/${req.params.id}?success=Successfully deposited ${value.amount} to account ${value.accNum}`)
                }else if(data[0].result == 3){
                    throw new Errors.BadRequest("Entered a negative balance");
                }else {
                    throw new Errors.InternalServerError("Something went wrong")
                }

            }).catch((err)=>{
                console.log(err);
                throw (err);
            });
        }


    }catch (e) {
        console.log(e);
        res.redirect(`/employee/${req.params.id}/customerTransaction?error=${e}`);
    }

}

async function registerEmployeePage(req,res){
    const branches = await DropdownService.getBranches();
    const posts = await DropdownService.getPosts();

    //console.log(posts);
    //console.log(branches);

    res.render('employee_reg_form',{
        error: req.query.error,
        user: req.session.user,
        first_name:req.query.first_name,
        last_name:req.query.last_name,
        name_with_initials:req.query.name_with_initials,
        age:req.query.age,
        dob:req.query.dob,
        add_no:req.query.add_no,
        add_street:req.query.add_street,
        add_city:req.query.add_city,
        postal_code:req.query.postal_code,
        nic:req.query.nic,
        contact:req.query.contact,
        username:req.query.username,
        email:req.query.email,
        branches:branches,
        posts:posts
        });
}

async function registerEmployeeAction(req,res){
    try{
        const postData = req.body;
        console.log(postData);
        const { value, error } = await EmployeeRegistrationInfo.validate(req.body);
        if (error) throw (error);

        let userAlreadyExist = await UserModel.getUserByEmail(value.email);
        if (userAlreadyExist) throw ("Already Registered by this email");

        userAlreadyExist = await UserModel.getUserUsername(value.username);
        if (userAlreadyExist) throw ("Already Registered by this username");

        userAlreadyExist = await EmployeeModel.getEmpDetailsByNIC(value.nic);
        if (userAlreadyExist) throw ("Already Registered by this nic");

        //console.log(userAlreadyExist);

        const password = gen_random_string();
        let acc = {
            username:value.username,
            password: await hash_password(password),
            email:value.email,
            first_name:value.first_name,
            last_name:value.last_name,
            name_with_init:value.name_with_initials,
            dob:ymd(new Date(value.dob.toString().split(' ').slice(1,4).join(' '))),
            postal_code:parseInt(value.postal_code),
            contact_No:parseInt(value.contact.split("-").join('')),
            NIC:value.nic,
            branch_id:parseInt(value.branch),
            gender:value.gender,
            house_no:value.add_no,
            street:value.add_street,
            city:value.add_city,
            post_id:parseInt(value.post),
        }
        console.log(acc.username);
        console.log(acc.password);

        await sendUserDetailsMail({
            email:acc.email,
            username:acc.username,
            password:password,
        });

        acc = ObjectToList(acc);

        //console.log(acc);



        EmployeeModel.addEmployee(acc).then((data)=>{
            //console.log(data)
            res.redirect('/?success=Successfully Added Account');
        }).catch((err)=>{
            console.log('error adding employee')
            throw (err);
        });




    }catch (e) {
        //console.log(errorsToList(e.details));
        res.redirect(`/employee/register?error=${e}&first_name=${req.body.first_name}&last_name=${req.body.last_name}&name_with_initials=${req.body.name_with_initials}&age=${req.body.age}&dob=${req.body.dob}&add_no=${req.body.add_no}&add_street=${req.body.add_street}&add_city=${req.body.add_city}&postal_code=${req.body.postal_code}&nic=${req.body.nic}&contact=${req.body.contact}&username=${req.body.username}&email=${req.body.email}`);
    }
}

async function  sendUserDetailsMail({
    email, username, password
}) {
    console.log(process.env.INVITATION_EMAIL);
    const emailComposition = {
        from: process.env.INVITATION_EMAIL,
        to: email,
        subject: 'Seychelles Bank Registration',
        template: 'invitation',
        context: {
            // registerURL: config.url.adminRegisterURL,
            username:username,
            password:password,
        },
    };

    console.log('email Composition');
    await sendMail(emailComposition);
}







module.exports.init = init;
module.exports.home = indexAction;