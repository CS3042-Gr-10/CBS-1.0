const { EmployeeRegistrationInfo } = require('../schema/Registration');
const iValidator = require('../../common/iValidator');
const Errors = require('../../common/error');
const UserService = require('../services/user.service');
const { errorsToList } = require('../../common/helpers');
const EmployeeModel = require('../models/Employee.model');

function init(router) {
    router.route('/employee/register')
        .get(registerEmployeePage)
        .post(registerEmployeeAction);
    router.route('/employee/:id')
        .get(indexAction);
        //.delete(deleteUser)
        //.put(updateUser);
    router.route('/employee/:id/registerCustomer')
        .get(registerCustomerAction)
        .post(registerCustomer)
}

async function indexAction(req,res){
    const userID = req.session.user.username;
    try{
        const User = await UserService.getUserById(userID);
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
        reg_date:req.query.reg_date,
    });
}

async function registerEmployeeAction(req,res){
    try{
        const postData = req.body;
        console.log(postData);
        const { value, error } = await EmployeeRegistrationInfo.validate(req.body);
        if (error) throw (error);
        const acc = {}

        // EmployeeModel.addEmployee()

    }catch (e) {
        res.redirect(`/employee/register?error=${e}
            &full_name=${req.body.full_name}
            &name_with_initials=${req.body.name_with_initials}
            &age=${req.body.age}
            &dob=${req.body.dob}
            &perm_address=${req.body.perm_address}
            &zip_code=${req.body.zip_code}
            &nic=${req.body.nic}
            &contact=${req.body.contact}
            &username=${req.body.username}
            &email=${req.body.email}
            &reg_date=${req.body.reg_date}
            `);
    }
}

async function registerCustomerAction(req,res){

    const branch_data =
    res.render('customer_reg_form',
        {

        }
        );
    //need the data of the branches to be populated



}

function registerCustomer(req,res){
    let registration_details = req.params;
    const json_format = iValidator.json_schema(customer_reg_schema.postSchema, registration_details, "Customer Registration");
    if (json_format.valid == false) {
        return res.status(422).send(json_format.errorMessage);
    }



}



module.exports.init = init;
module.exports.home = indexAction;