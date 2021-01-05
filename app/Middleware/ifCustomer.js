const ifCustomer = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === 1) { // if student
            next();
        }
    } else {
        res.redirect('/');
    }
};

module.exports = ifCustomer;
