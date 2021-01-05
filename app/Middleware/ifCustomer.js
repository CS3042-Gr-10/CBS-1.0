const ifCustomer = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === 1) { // if student
            console.log(`ifcustomer pass ${req.session.user.acc_level}`)
            next();

        }
    } else {
        console.log(`ifcustomer fail ${req.session.user.acc_level}`)
        res.redirect('/');
    }
};

module.exports = ifCustomer;
