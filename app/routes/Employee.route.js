const { EmployeeRegistrationInfo, CustomerRegistrationSavingsInfo, CustomerRegistrationGeneralInfo, ExistingCustomerAccountInfo } = require('../schema/Registration');
const { usernameInfo, nicInfo} = require('../schema/Authentication');
const { TransactionInfo, accountNumberInfo, customerLoanInfo, organizationLoanInfo } = require('../schema/Employee');
const Errors = require('../../common/error');
const DropdownService = require('../services/Dropdown.service');
const { ObjectToList, hash_password } = require('../../common/helpers');
const EmployeeModel = require('../models/Employee.model');
const CustomerModel = require('../models/Customer.model');
const sendMail = require('../../common/Emailer/send_mail');
const UserModel = require('../models/User.model');
const AccountModel = require('../models/Account.model');
const TransactionModel = require('../models/Transaction.model');
const OrganizationModel = require('../models/Organization.model');
const LoanModel = require('../models/Loan.model');
const { gen_random_string } = require('../../common/token_generator');
const  { ymd } = require('../../common/dateFormat');
const { check_ageRange } = require('../enums/savings_account_plan_age');

function init(router) {
    router.route('/employee/register')
        .get(registerEmployeePage)
        .post(registerEmployeeAction);
    router.route('/employee/:id')
        .get(indexAction);
    router.route('/employee/:id/registerCustomer')
        .get(registerAccountAndCustomerPage)
        .post(registerCustomerAndAccount);
    router.route('/employee/:id/registerExistingCustomer')
        .get(existingCustomerAndAccountPage);
    router.route("/employee/:id/addAccount/:user_id")
        .post(addAccount)
    router.route("/employee/:id/AccountDetails")
        .get(getCustomerDetails)
    router.route("/employee/:id/customerTransaction")
        .get(customerTransactionPage)
        .post(customerTransaction)
    router.route("/employee/:id/customerLoan")
        .get(customerLoanPage)
        .post(customerLoan)
    router.route("/employee/:id/organizationLoan")
        .get(organizationLoanPage)
        .post(organizationLoan)

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

async function customerLoanPage(req,res){
    const branches = await DropdownService.getBranches();

    res.render('employee_new_loan',{
        error:req.query.error,
        success:req.query.success,
        user: req.session.user,
        branches:branches,
        nic:req.query.nic,
        income:req.query.income,
        amount:req.query.amount,
        interest:req.query.interest,
        time:req.query.time,
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
            inter_rate:parseFloat(value.interest),
            aggreed_num_inst_d:installment,
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
        res.redirect(`/employee/${req.params.id}?error=${err.message}&nic=${req.body.nic}&income=${req.body.income}&amount=${req.body.amount}&interest=${req.body.interest}&time${req.body.time}`)
    }
}

async function organizationLoanPage(req,res){
    const branches = await DropdownService.getBranches();
    const posts = await DropdownService.getPosts();

    res.render('employee_new_loan_organization',{
        error:req.query.error,
        success:req.query.success,
        user: req.session.user,
        branches:branches,
        org_id:req.query.org_id,
        income:req.query.income,
        amount:req.query.amount,
        interest:req.query.interest,
        time:req.query.time,
    });
}

async function organizationLoan(req,res){
    try{
        const { value, error } = await organizationLoanInfo.validate(req.body);
        if (error) throw (error);

        const customer = await OrganizationModel.getOrgDetails(value.org_id);
        if (!customer) throw new Errors.NotFound("Customer not found");

        const installment = (parseFloat(value.amount)*parseFloat(value.interest))/parseInt(value.time)

        let Loan = {
            customer_id_d: customer.user_id,
            loaned_amount_d:parseFloat(value.amount),
            inter_rate:parseFloat(value.interest),
            aggreed_num_inst_d:installment,
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
        res.redirect(`/employee/${req.params.id}?error=${err.message}&org_id=${req.body.org_id}&income=${req.body.income}&amount=${req.body.amount}&interest=${req.body.interest}&time${req.body.time}`)
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
            if(!account) throw (Errors.NotFound("No such Account Exists"))
            console.log(account);

            const deposits = await TransactionModel.getAllDepositDetailByID(req.query.accNum);
            const withdrawals = await TransactionModel.getAllWithdrawDetailByID(req.query.accNum);

            const Customer = await CustomerModel.getCustomerDetailsById(account.user);

            console.log({
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
            if(!account) throw (Errors.NotFound("No such Account Exists"))

            const organization = await OrganizationModel.getOrgDetails(account.user);
            if (!organization) throw (Errors.NotFound("No such Account Exists"))


            const deposits = await TransactionModel.getAllDepositDetailByID(req.query.accNum);
            const withdrawals = await TransactionModel.getAllWithdrawDetailByID(req.query.accNum);



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
                    res.redirect(`/employee/${req.params.id}?success=Successfully Savings amount`)
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
                    res.redirect(`/employee/${req.params.id}?success=Successfully deposited amount`)
                }else if(data.result[0] == 3){
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

async function  registerAccountAndCustomerPage(req, res){
    const branches = await DropdownService.getBranches();
    const savings_plan = await DropdownService.getSavingAccPlans();

    res.render('customer_reg_form', {
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

async function registerCustomerAndAccount(req, res){
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
            acc_type: req.body.acc_type,
            init_amount: req.body.init_amount,
            email: req.body.email,
            branch: req.body.branch,
            agree_check:req.body.agree_check
        }

        let { value, error } = await CustomerRegistrationGeneralInfo.validate(general);
        if (error) throw (error);


        if (value.acc_type === 'savings'){
            const { obj, error } = await CustomerRegistrationSavingsInfo.validate({
                savings_plan:req.body.savings_plan
            });
            // console.log(obj);
            // console.log(req.body.savings_plan);
            if (error) throw (error);
            value = {
                ...value,
                savings_plan:req.body.savings_plan,
            }
        }

        console.log(value);


        let userAlreadyExist = await UserModel.getUserByEmail(value.email);
        if (userAlreadyExist) throw ("Already Registered by this email");

        userAlreadyExist = await EmployeeModel.getEmpDetailsByNIC(value.nic);
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

        if(value.acc_type === 'savings' && !check_ageRange(parseFloat(value.age),value.savings_plan)){
            throw new Errors.BadRequest("Age doesn't match with the savings account plan");
        }

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

        const user = await UserModel.getUserUsername(username);


        if (value.acc_type === 'savings'){
            //console.log(value);
            //console.log('Here');
            //console.log(user.user_id);
            let savings = {
              branch_id:parseInt(value.branch),
              acc_balance:parseFloat(value.init_amount),
              usr_id:user.user_id,
              account_plan_id:parseInt(value.savings_plan),
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
            //console.log('Not Here');
            let current ={
                branch_id: parseInt(value.branch) ,
                acc_balance: parseFloat(value.init_amount),
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
        res.redirect(`/employee/${req.params.id}/registerCustomer?error=${e}&first_name=${req.body.first_name}&last_name=${req.body.last_name}&name_with_initials=${req.body.name_with_initials}&age=${req.body.age}&dob=${req.body.dob}&add_no=${req.body.add_no}&add_street=${req.body.add_street}&add_city=${req.body.add_city}&postal_code=${req.body.postal_code}&nic=${req.body.nic}&contact=${req.body.contact}&username=${req.body.username}&email=${req.body.email}`);
    }
}

async function existingCustomerAndAccountPage(req,res){
    try{
        //console.log(req.body);
        //console.log(req.query);

        const branches = await DropdownService.getBranches();
        const savings_plan = await DropdownService.getSavingAccPlans();

        let Info,customerInfo,userInfo;
        if(req.query.username){
            const {username, error} = await usernameInfo.validate({username:req.query.username});
            if (error) throw (error);
            userInfo = await UserModel.getUserUsername(req.query.username);
            if(!userInfo) throw new Errors.BadRequest("NO such Customer");
            customerInfo = await CustomerModel.getCustomerDetailsById(userInfo.user_id);


            Info = {
                ...userInfo,
                ...customerInfo
            };

        }else if(req.query.nic){

            const {nic, error} = await nicInfo.validate({nic:req.query.nic});
            if (error) throw (error);

            customerInfo = await CustomerModel.getCustomerDetailsByNIC(req.query.nic);
            if(!customerInfo) throw new Errors.BadRequest("NO such Customer");
            userInfo = await UserModel.getUserByID(customerInfo.user_id);

            Info = {
                ...userInfo,
                ...customerInfo
            }
        }

        console.log(Info);

        if(Info.user_id){
            res.render('existing_customer_reg_form', {
                error: req.query.error,
                user: req.session.user,
                user_id:Info.user_id,
                first_name:Info.first_name,
                last_name:Info.last_name,
                name_with_initials:Info.name_with_init,
                dob:Info.dob,
                add_no:Info.house_no,
                add_street:Info.street,
                add_city:Info.city,
                postal_code:Info.postal_code,
                nic:Info.NIC,
                contact:Info.contact_primary,
                email:Info.email,
                gender:Info.gender,
                branches:branches,
                savings_plan:savings_plan
            });
        }else{
            res.redirect(`/employee/${req.params.id}?error=Error In the entered Username or NIC`)
        }
    }catch (e) {
        console.log(e);
        console.log(e.message);
        res.redirect(`/employee/${req.params.id}?error=${e.message}`)
    }

}

async function addAccount(req,res){
    try{
        //console.log(req.body);
        //console.log(req.params.user_id);
        let {validated,error} = await ExistingCustomerAccountInfo.validate({
            acc_type: req.body.acc_type,
            init_amount: req.body.init_amount,
            branch: req.body.branch,
            agree_check: req.body.agree_check
        });
        if (error) throw (error);

        if(req.body.acc_type === 'savings'){
            let {validated,error} = await CustomerRegistrationSavingsInfo.validate({
                savings_plan:req.body.savings_plan
            });
            if (error) throw (error);

            let savings = {
                branch_id:parseInt(req.body.branch),
                acc_balance:parseFloat(req.body.init_amount),
                usr_id:req.params.user_id,
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
                    throw Errors.Unauthorized("Age range doesnt map with selected plan")
                }else{
                    throw Errors.Unauthorized("Not enough balance")
                }

            }).catch((err)=>{
                console.log(err);
                throw (err);
            })
        }else if (req.body.acc_type === 'current'){
            //let {validated,error} = await CustomerRegistrationCurrentInfo.validate({
            //    savings_plan:req.body.savings_plan
            //});
            //if (error) throw (error);

            let current ={
                branch_id: parseInt(req.body.branch) ,
                acc_balance: parseFloat(req.body.init_amount),
                usr_id: req.params.user_id,
            }

            console.log(current);
            current = ObjectToList(current);
            console.log(current);

            await AccountModel.addCurrentAccount(current).then(()=>{
                console.log('Current account added');
                res.redirect(`/employee/${req.params.id}?success=Current account made`)
            }).catch((err)=>{
                console.log(err);
                throw (err);
            })

        }else {
            res.redirect(`/employee/${req.params.id}?error=Account type error`);
        }

    }catch (e) {
        console.log(e);
        res.redirect(`/employee/${req.params.id}?error=${e}`);
    }
}







module.exports.init = init;
module.exports.home = indexAction;