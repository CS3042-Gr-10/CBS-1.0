const ifLoggedIn = (req, res, next) => {
    console.log(req.session.user);
    if (req.session.user) {
        console.log("is logged")
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = ifLoggedIn;
