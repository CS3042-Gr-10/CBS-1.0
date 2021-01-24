const customer_reg_schema = require('../schema/CustomerRegistrationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const errortype = require('../../common/error-type');
const Errors = require('../../common/error');
const UserService = require('../services/user.service');
const EmployeeService = require('../services/Employee.service')
const GeneralError = errortype.RedirectGeneralError;

function init(router) {
    router.route('/Employee')
        .get(GeneralError)
    router.route('/Employee/:id')
        .get(indexAction);
        //.delete(deleteUser)
        //.put(updateUser);
    router.route('/Employee/:id/registerCustomer')
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
    //userService.getUserById(userId).then((data) => {

    //}).catch((err) => {
    //    mail.mail(err);
    //    res.send(err);
    //});
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