
const userService = require('../services/user.service');
const schema = require('../schema/userValidationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errortype = require('../../common/error-type');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');
//const errors = require('../app/routes/error.route')
const GeneralError = errortype.RedirectGeneralError;

function init(router) {
    router.route('/BankManager')
        .get(GeneralError);
    router.route('/BankManager/:id')
        .get(getUserById)
        .delete(deleteUser)
        .put(updateUser);
}





module.exports.init = init;