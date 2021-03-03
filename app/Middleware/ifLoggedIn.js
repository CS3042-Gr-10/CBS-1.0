const ifLoggedIn = (req, res, next) => {

    //console.log('ifLoggedIn.............function');
    if (req.session.user) {
        //console.log("is logged")
        next();
    } else {
        //console.log(req.session.user);
        res.redirect('/');
    }
};

module.exports = ifLoggedIn;
