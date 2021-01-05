const ifEmployee = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === 2) { // if student
            next();
        }
    } else {
        res.redirect('/');
    }
};

module.exports = ifEmployee;
