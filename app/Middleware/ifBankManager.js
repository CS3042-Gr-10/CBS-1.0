const ifBankManager = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === "BANK-MANAGER") { // if ins
            console.log("is_bm")
            next();
        }
    } else {
        console.log("is_notbm")
        res.redirect('/');
    }
};

module.exports = ifBankManager;
