const schema = require('../schema/userValidationSchema.json')
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');


function init(router) {
    router.route('/user')
        .get(getAllUsers)
        .post(addUser);
    router.route('/user/:id')
        .get(getUserById)
        .delete(deleteUser)
        .put(updateUser);
}



module.exports.init = init;