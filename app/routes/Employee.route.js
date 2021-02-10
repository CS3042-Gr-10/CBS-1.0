const { EmployeeRegistrationInfo, CustomerRegistrationSavingsInfo, CustomerRegistrationGeneralInfo, ExistingCustomerAccountInfo } = require('../schema/Registration');
const { usernameInfo, nicInfo} = require('../schema/Authentication');
const Errors = require('../../common/error');
const DropdownService = require('../services/Dropdown.service');
const { ObjectToList, hash_password } = require('../../common/helpers');
const EmployeeModel = require('../models/Employee.model');
const CustomerModel = require('../models/Customer.model');
const UserModel = require('../models/User.model');
const AccountModel = require('../models/Account.model');
const { gen_random_string } = require('../../common/token_generator');
const  { ymd } = require('../../common/dateFormat');

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



}

async function indexAction(req,res){
    // console.log(req.session.user);
    const userID = req.session.user.user_id;
    try{
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


        let acc = {
            username:value.username,
            password: await hash_password(gen_random_string()),
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

async function  registerAccountAndCustomerPage(req, res){
    const branches = await DropdownService.getBranches();
    const savings_plan = await DropdownService.getSavingAccPlans();

    console.log(req.session.user);
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
              account_plan_id:parseInt(value.savings_plan)
            }

            console.log(savings);

            savings = ObjectToList(savings);
            await AccountModel.addSavingAccount(savings).then(()=>{
                console.log('Savings account added');
                res.redirect(`/employee/${req.params.id}?success=Savings account made`)
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
                account_plan_id:parseInt(req.body.savings_plan)
            }

            console.log(savings);

            savings = ObjectToList(savings);
            await AccountModel.addSavingAccount(savings).then(()=>{
                console.log('Savings account added');
                res.redirect(`/employee/${req.params.id}?success=Savings account made`)
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

        res.redirect(`/employee/${req.params.id}`);

    }catch (e) {
        console.log(e);
        res.redirect(`/employee/${req.params.id}?error=${e}`);
    }
}





module.exports.init = init;
module.exports.home = indexAction;