const ifCustomer = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === "CUSTOMER") { // if student
            //console.log("iscustomer")
            next();
        }
    } else {
        //console.log("isnotcustomer")
        res.redirect('/');
    }
};

module.exports = ifCustomer;
