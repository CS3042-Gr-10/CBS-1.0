const userService = require('../services/user.service');
const schema = require('../schema/userValidationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');



function init(router) {
    router.route('/error')
        .get(GeneralError)

    router.route('/error/NoAccessError')
        .get(NoAccessError);
};

function GeneralError(req,res){
    res.send('<h1>General Error</h1>')
};

function NoAccessError(req,res){
    res.send('<h1>You Have No Access</h1>')
};




module.exports.init = init
