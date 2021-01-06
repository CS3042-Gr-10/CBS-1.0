const Employee = require('./Employee.route');
const Admin = require('./Admin.route');
const BankManager = require('./BankManager.route');
const Customer = require('./Customer.route');


const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else if (req.session.user.acc_level === 0) { // if admin
        res.redirect('/admin');
    } else if (req.session.user.acc_level === 1) { // if ins
        Customer.home(req,res);
    } else if (req.session.user.acc_level === 2) { // if student
        Employee.home(req,res);
    }
};

module.exports = ifNotLoggedIn;
