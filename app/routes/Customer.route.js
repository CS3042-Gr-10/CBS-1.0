const schema = require('../schema/userValidationSchema.json')
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const errortype = require('../../common/error-type');
const mail = require('./../../common/mailer.js');
const ifLoggedIn = require('./../Middleware/ifLoggedIn')
const ifCustomer = require('./../Middleware/ifCustomer')
const GeneralError = errortype.RedirectGeneralError;

function init(router) {
    router.use('/Customer', ifLoggedIn)
    router.use('/Customer', ifCustomer)
    router.route('/Customer')
        .get(GeneralError)
    router.route('/Customer/:id')
        .get(indexAction);
}

function indexAction(req,res){
    //EmployeeService.
    const userID = req.session.user.username;
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



module.exports.init = init;