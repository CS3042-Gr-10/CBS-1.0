const ifLoggedIn = (req, res, next) => {
    if (req.session.user) {
        console.log(`ifLogged pass ${req.session.user}`)
        next();
    } else {
        console.log(`ifLogged fail ${req.session.user}`)
        res.redirect('/');
    }
};

module.exports = ifLoggedIn;
