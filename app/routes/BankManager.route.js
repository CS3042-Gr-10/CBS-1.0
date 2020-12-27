const userService = require('../services/user.service');
const user_schema = require('../schema/userValidationSchema.json');
const customer_reg_schema = require('../schema/CustomerRegistrationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');
const errortype = require('../../common/error-type');
const GeneralError = errortype.RedirectGeneralError;

function init(router) {
    router.route('/Employee')
        .get(GeneralError)
    //router.route('/Employee/:id/registerCustomer')
    //    .get(registerCustomerAction)
    //    .post(registerCustomer)
}

module.exports.init = init;