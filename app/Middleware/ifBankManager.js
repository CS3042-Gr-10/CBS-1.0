const ifBankManager = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === 3) { // if ins
            next();
        }
    } else {
        res.redirect('/');
    }
};

module.exports = ifBankManager;
