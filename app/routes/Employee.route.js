const { EmployeeRegistrationInfo, CustomerRegistrationInfo } = require('../schema/Registration');
const Errors = require('../../common/error');
const DropdownService = require('../services/Dropdown.service');
const { errorsToList } = require('../../common/helpers');
const EmployeeModel = require('../models/Employee.model');
const CustomerModel = require('../models/Customer.model')
const { gen_random_string } = require('../../common/token_generator')

function init(router) {
    router.route('/employee/register')
        .get(registerEmployeePage)
        .post(registerEmployeeAction);
    router.route('/employee/:id')
        .get(indexAction);
        //.delete(deleteUser)
        //.put(updateUser);
    router.route('/employee/:id/registerCustomer')
        .get(registerCustomerPage)
        .post(registerCustomerAction)
    router.route('/employee/:id/openSavingAccount')
      .get(openSavingsAccountPage)
      .post(openSavingsAccount)

}

async function indexAction(req,res){
    const userID = req.session.user.username;
    try{
        const User = await EmployeeModel.getEmpDetails(nodemonuserID);
        if (!User){
            throw new Errors.BadRequest('An Error Occurred in the Database');
        }

        res.render('employee_dashboard',
          {
              url_params: req.params,
              User:User
          }
        )
    }catch (e){
        res.redirect(`/?error=${e}`);
    }

}

async function registerEmployeePage(req,res){
    const branches = await DropdownService.getBranches();
    const posts = await DropdownService.getPosts();

    console.log(branches);
    console.log(req.query.error);

    res.render('employee_reg_form',{
        error: req.query.error,
        user: req.session.user,
        full_name:req.query.full_name,
        name_with_initials:req.query.name_with_initials,
        age:req.query.age,
        dob:req.query.dob,
        perm_address:req.query.perm_address,
        zip_code:req.query.zip_code,
        nic:req.query.nic,
        contact:req.query.contact,
        username:req.query.username,
        email:req.query.email,
        });
}

async function registerEmployeeAction(req,res){
    try{
        const postData = req.body;
         console.log(postData);
        const { value, error } = await EmployeeRegistrationInfo.validate(req.body);
        if (error) throw (error);

        let post_id;
        if(value.employee_level === 'employee'){
            post_id = 0;
        }else{
            post_id = 1;
        }

        //console.log(gen_random_string());
        //console.log(value.full_name.split(" ")[0]);
       // console.log(value.full_name.split(" ").slice(1).join(''));
        //console.log(value.perm_address.split(" ")[0]);
        //console.log(value.perm_address.split(" ").slice(1,value.perm_address.split(" ").length-1).join(''));
        //console.log(value.perm_address.split(" ")[value.perm_address.split(" ").length-1]);
        //console.log(parseInt(value.contact.split("-").join('')));
        //console.log(value.dob.toString().split(' ').slice(1,4).join(' '));
        //console.log();

        const acc = {
            username:value.username,
            password:gen_random_string(),
            email:value.email,
            first_name:value.full_name.split(" ")[0],
            last_name:value.full_name.split(" ").slice(1).join(' '),
            name_with_init:value.name_with_initials,
            dob:new Date(value.dob.toString().split(' ').slice(1,4).join(' ')),
            postal_code:parseInt(value.postal_code),
            contact_No:parseInt(value.contact.split("-").join('')),
            NIC:value.nic,
          //  branch_id:value.branch,
            branch_id:1,
            gender:value.gender,
            house_no:value.perm_address.split(" ")[0],
            street:value.perm_address.split(" ").slice(1,value.perm_address.split(" ").length-1).join(' '),
            city:value.perm_address.split(" ")[value.perm_address.split(" ").length-1],
            post_id:post_id,
        }

        console.log(acc);



        EmployeeModel.addEmployee(acc).then(()=>{
            console.log("add Employee")
            res.redirect('/login?success=Successfully Added Account')
        }).catch((err)=>{
            console.log('error adding employee')
            throw (err);
        });



    }catch (e) {
        //console.log(errorsToList(e.details));
        res.redirect(`/employee/register?error=${e}&full_name=${req.body.full_name}&name_with_initials=${req.body.name_with_initials}&age=${req.body.age}&dob=${req.body.dob}&perm_address=${req.body.perm_address}&zip_code=${req.body.postal_code}&nic=${req.body.nic}&contact=${req.body.contact}&username=${req.body.username}&email=${req.body.email}`);
    }
}

async function registerCustomerPage(req,res){

    const branches = await DropdownService.getBranches();
    res.render('customer_reg_form', {
        error: req.query.error,
        user: req.session.user,
        full_name:req.query.full_name,
        name_with_initials:req.query.name_with_initials,
        age:req.query.age,
        dob:req.query.dob,
        perm_address:req.query.perm_address,
        zip_code:req.query.zip_code,
        nic:req.query.nic,
        contact:req.query.contact,
        username:req.query.username,
        email:req.query.email,
    });

    console.log(branches);
    console.log(req.query.error);



}

async function registerCustomerAction(req,res){
    const postData = req.body;
    try{
    // console.log(postData);
        const { value, error } = await CustomerRegistrationInfo.validate(req.body);
        if (error) throw (error);

        let acc_level ,post_id;
        if(value.employee_level === 'employee'){
            acc_level = "EMPLOYEE"
            post_id = 0;
        }else{
            acc_level = "BANKMANAGER"
            post_id = 1;
        }

        console.log(gen_random_string());
        console.log(value.full_name.split(" ")[0]);
        console.log(value.full_name.split(" ").slice(1).join(''));
        console.log(value.perm_address.split(" ")[0]);
        console.log(value.perm_address.split(" ").slice(1,value.perm_address.split(" ").length-1).join(''));
        console.log(value.perm_address.split(" ")[value.perm_address.split(" ").length-1]);
        console.log(parseInt(value.contact.split("-").join('')));

        const acc = {
            username:value.username,
            password:gen_random_string(),
            email:value.email,
            acc_level:acc_level,
            first_name:value.full_name.split(" ")[0],
            last_name:value.full_name.split(" ").slice(1).join(''),
            name_with_init:value.name_with_initials,
            dob:value.dob,
            postal_code:parseInt(value.postal_code),
            contact_No:parseInt(value.contact.split("-").join('')),
            NIC:value.nic,
            //  branch_id:value.branch,
            branch_id:1,
            gender:value.gender,
            house_no:value.perm_address.split(" ")[0],
            street:value.perm_address.split(" ").slice(1,-1).join(''),
            city:value.perm_address.split(" ")[-1],
            post_id:post_id,
        }

        console.log(acc);



        CustomerModel.addCustomer(acc).then(()=>{
            console.log("add Customer")
            res.redirect(`/employee/${req.param.id}?success=Successfully Added Account`);
        }).catch((err)=>{
            console.log('error adding customer')
            throw (err);
        });

        }
    catch (e) {
        //console.log(errorsToList(e.details));
        res.redirect(`/employee/register?error=${e}&full_name=${req.body.full_name}&name_with_initials=${req.body.name_with_initials}&age=${req.body.age}&dob=${req.body.dob}&perm_address=${req.body.perm_address}&zip_code=${req.body.postal_code}&nic=${req.body.nic}&contact=${req.body.contact}&username=${req.body.username}&email=${req.body.email}`);
    }



}

async function openSavingsAccountPage(req,res){
    const branches = await DropdownService.getBranches();
    res.render('',{
      branch_id:'',
      acc_balance:'',
      usr_id:'',
      acc_type:'',
      account_plan_id:'',
    })
}

async function openSavingsAccount(req,res){

}



module.exports.init = init;
module.exports.home = indexAction;