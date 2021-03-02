
const ifNotLoggedIn = (req, res, next) => {
    // console.log(req.url);
    console.log('here');
    console.log(req.session);

    if (!req.session.user) {
        console.log("isnotlogged")
        next();
    } else if (req.session.user.acc_level === "BANK-MANAGER") { // if admin
        res.redirect(`/BankManager/${req.session.user.user_id}?error=You are already logged in`);
    } else if (req.session.user.acc_level === "EMPLOYEE") { // if ins
        res.redirect(`/Employee/${req.session.user.user_id}?error=You are already logged in`);
    } else if (req.session.user.acc_level === "CUSTOMER") { // if student
        res.redirect(`/Customer/${req.session.user.user_id}?error=You are already logged in`);
    }
};

module.exports = ifNotLoggedIn;
