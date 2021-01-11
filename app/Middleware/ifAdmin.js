const ifAdmin = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === 0) { // if admin
            next();
        }
    } else {
        res.redirect('/');
    }
};

module.exports = ifAdmin;
