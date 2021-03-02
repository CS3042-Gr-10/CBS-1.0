
const ifNotLoggedIn = (req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user) {
        console.log("isnotlogged")
        next();
    } else if (req.session.user.acc_level === "BANK-MANAGER") { // if admin
        res.redirect(`/BankManager/${req.session.user.user_id}?error=You are logged in, can't register`);
    } else if (req.session.user.acc_level === "Employee") { // if ins
        res.redirect(`/Employee/${req.session.user.user_id}?error=You are logged in, can't register`);
    } else if (req.session.user.acc_level === "CUSTOMER") { // if student
        res.redirect(`/Customer/${req.session.user.user_id}?error=You are logged in, can't register`);
    }
};

module.exports = ifNotLoggedIn;
