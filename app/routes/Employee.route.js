const { EmployeeRegistrationInfo } = require('../schema/Registration');
const Errors = require('../../common/error');
const DropdownService = require('../services/Dropdown.service');
const { errorsToList } = require('../../common/helpers');
const EmployeeModel = require('../models/Employee.model');
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

        let acc_level;
        if(value.employee_level === 'employee'){
            acc_level = "EMPLOYEE"
        }else{
            acc_level = "BANKMANAGER"
        }

        console.log(gen_random_string());
        console.log(value.full_name.split(" ")[0]);
        console.log(value.full_name.split(" ").slice(1).join(''));
        console.log(value.perm_address.split(" ")[0]);
        console.log(value.perm_address.split(" ").slice(1,value.perm_address.split(" ").length-1).join(''));
        console.log(value.perm_address.split(" ")[value.perm_address.split(" ").length-1]);

        const acc = {
            username:value.username,
            password:gen_random_string(),
            email:value.email,
            acc_level:acc_level,
            first_name:value.full_name.split(" ")[0],
            last_name:value.full_name.split(" ").slice(1).join(''),
            name_with_init:value.name_with_initials,
            dob:value.dob,
            postal_code:value.postal_code,
            contact_No:value.contact,
            NIC:value.nic,
            branch_id:value.branch,
            gender:value.gender,
            house_no:value.perm_address.split(" ")[0],
            street:value.perm_address.split(" ").slice(1,-1).join(''),
            city:value.perm_address.split(" ")[-1],
            post_id:0b000,
        }



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

function registerCustomerAction(req,res){
    let registration_details = req.params;
    const json_format = iValidator.json_schema(customer_reg_schema.postSchema, registration_details, "Customer Registration");
    if (json_format.valid == false) {
        return res.status(422).send(json_format.errorMessage);
    }



}



module.exports.init = init;
module.exports.home = indexAction;