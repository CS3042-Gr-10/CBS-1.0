const { EmployeeRegistrationInfo, CustomerRegistrationSavingsInfo, CustomerRegistrationGeneralInfo } = require('../schema/Registration');
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
        //.delete(deleteUser)
        //.put(updateUser);
    router.route('/employee/:id/registerCustomer')
        .get(registerAccountAndCustomerPage)
        .post(registerCustomerAndAccount)


}

async function indexAction(req,res){
    console.log(req.session.user);
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

        console.log(Emp);
        res.render('employee_dashboard',
          {
              url_params: req.params,
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

    //console.log(branches);
    //console.log(req.query.error);

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
        branches:branches
        });
}

async function registerEmployeeAction(req,res){
    try{
        const postData = req.body;
         //console.log(postData);
        const { value, error } = await EmployeeRegistrationInfo.validate(req.body);
        if (error) throw (error);

        let userAlreadyExist = await UserModel.getUserByEmail(value.email);
        if (userAlreadyExist) throw ("Already Registered by this email");

        userAlreadyExist = await UserModel.getUserUsername(value.username);
        if (userAlreadyExist) throw ("Already Registered by this username");

        userAlreadyExist = await EmployeeModel.getEmpDetailsByNIC(value.nic);
        if (userAlreadyExist) throw ("Already Registered by this nic");

        //console.log(userAlreadyExist);
        let post_id;
        if(value.employee_level === 'employee'){
            post_id = 2;
        }else{
            post_id = 1;
        }


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
            branch_id:value.branch_id,
            gender:value.gender,
            house_no:value.add_no,
            street:value.add_street,
            city:value.add_city,
            post_id:post_id,
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
            if (error) throw (error);
            value = {
                ...value,
                ...obj
            }
        }

        // console.log(value);


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
            acc_level:0,
        }
        console.log(username);


        acc = ObjectToList(acc);
        console.log(acc);

        CustomerModel.addCustomer(acc).then((data)=>{
            return;
        }).catch((err)=>{
            console.log('error adding employee')
            throw (err);
        })

        const user = await UserModel.getUserUsername(acc.usr);

        if (value.acc_type === 'savings'){

            console.log('Here');
            console.log(user.user_id);
            let savings = {
              branch_id:parseInt(value.branch),
              acc_balance:parseFloat(value.init_amount),
              usr_id:user.user_id,
              acc_type:"SAVINGS",
              account_plan_id:parseInt(value.savings_plan)
            }

            console.log(savings);

            savings = ObjectToList(savings);
            AccountModel.addSavingAccount(savings).then(()=>{
                console.log('Savings account added');
                res.redirect(`/employee/${req.params.id}?success=Savings account made`)
            }).catch((err)=>{
                console.log(err);
                throw (err);
            })
        }else {
            console.log('Not Here');
            let current ={
                branch_id: parseInt(value.branch) ,
                acc_balance: parseFloat(value.init_amount),
                usr_id: user.user_id,
                acc_type: "CURRENT"
            }

            console.log(current);
            current = ObjectToList(current);

            AccountModel.addCurrentAccount(current).then(()=>{
                console.log('Savings account added');
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
        const branches = await DropdownService.getBranches();

        let Info;
        if(req.body.username){
            const userInfo = await UserModel.getUserUsername(req.body.username);
            if(!userInfo) throw new Errors.BadRequest("NO such Customer");
            const customerInfo = await CustomerModel.getCustomerDetails(userInfo.user_id);

            Info = {
                ...userInfo,
                ...customerInfo
            };
        }else {
            if(req.body.nic){
                Info =await CustomerModel.getCustomerDetails(req.body.nic);
                if(!Info) throw new Errors.BadRequest("NO such Customer");
            }
        }

        if(Info){
            res.render('existing_customer_reg_form', {
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
                zip_code:req.query.zip_code,
                nic:req.query.nic,
                contact:req.query.contact,
                username:req.query.username,
                email:req.query.email,
                branches:branches,
                existing:false
            });
        }else{

        }
    }catch (e) {
        res.redirect(`/employee/${req.params.user_id}/registerCustomer?error=${e}&`)
    }

}





module.exports.init = init;
module.exports.home = indexAction;