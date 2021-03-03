const ifEmployeeCreatable = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === "BANK-MANAGER") { // if ins
            next();
        }
        if (req.session.user.acc_level === "Employee"){
            res.redirect(`/Employee/${req.session.user.user_id}?error=Not Permitted`);
        }else if (req.session.user.acc_level === "Employee") {
            res.redirect(`/Employee/${req.session.user.user_id}?error=Not Permitted`);
        }

        } else {
        next();
    }
};

module.exports = ifEmployeeCreatable;
