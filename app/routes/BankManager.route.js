const BankManagerService = require('../services/BankManager.service');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const error_type = require('../../common/error-type');
const GeneralError = error_type.RedirectGeneralError;

function init(router) {
    router.route('/Employee')
        .get(GeneralError)
    //router.route('/Employee/:id/registerCustomer')
    //    .get(registerCustomerAction)
    //    .post(registerCustomer)
}

function indexAction(req,res,data){
    //EmployeeService.
    res.render('employee_dashboard',
        {
            "full_name": data.username
        }
    )
    //userService.getUserById(userId).then((data) => {

    //}).catch((err) => {
    //    mail.mail(err);
    //    res.send(err);
    //});
}

module.exports.init = init;
module.exports.home = indexAction;