const userService = require('../services/user.service');
const user_schema = require('../schema/userValidationSchema.json');
const customer_reg_schema = require('../schema/CustomerRegistrationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');


function init(router) {
    router.route('/Employee')
        .get(getAllUsers)
        .post(addUser);
    router.route('/Employee/:id')
        .get(indexAction)
        .delete(deleteUser)
        .put(updateUser);
    router.route('/Employee/:id/registerCustomer')
        .get(registerCustomerAction)
        .post(registerCustomer)
}

function indexAction(req,res){
    let userId = req.params;

    const json_format = iValidator.json_schema(user_schema.getSchema, userId, "user");
    if (json_format.valid == false) {
        return res.status(422).send(json_format.errorMessage);
    }

    userService.getUserById(userId).then((data) => {
        res.render(
            'employee_dashboard',
            data
        )
    }).catch((err) => {
        mail.mail(err);
        res.send(err);
    });
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