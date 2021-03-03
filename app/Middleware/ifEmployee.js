const ifEmployee = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.acc_level === "EMPLOYEE") { // if student
            //console.log("is emp")
            next();
        }
    } else {
        //console.log("is_notemp")
        res.redirect('/');
    }
};

module.exports = ifEmployee;
