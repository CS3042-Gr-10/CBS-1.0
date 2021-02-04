const EmployeeService = require('../services/Employee.service');
const customer_reg_schema = require('../schema/CustomerRegistrationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const errortype = require('../../common/error-type');
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

function indexAction(req,res){
    const userID = req.session.username;
    //EmployeeService.
    res.render('employee_dashboard',
        {
            "full_name": userID
        }
    )
    //userService.getUserById(userId).then((data) => {

    //}).catch((err) => {
    //    mail.mail(err);
    //    res.send(err);
    //});
}

function registerCustomerAction(req,res){
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