const bcrypt = require('bcryptjs');


function get_password(password) {
    
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            else{
                console.log(hash)
            }
        })

    });
}

get_password("UserED005");