const Joi = require('joi')

const LogInInfo = Joi.object().options({ abortEarly: false }).keys({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message("Password should consist between 3-30 characters.").required().label("Password").message("Password is required."),   //regex added
  username: Joi.string().alphanum().min(3).message("User name must have minimum 3 characters.").max(15).message("User name must have maximum 30 characters.").required().message("User name is required").label("Username"),
});     //added alphanum , maxlen and minlen

const usernameInfo = Joi.object().options({abortEarly:false}).keys({
  username:Joi.string().required().label("Username")
})

const nicInfo = Joi.object().options({abortEarly:false}).keys({
 /* nic:Joi.string().required().label("NIC Number")
   // .min(10)
    //.message('"NIC Number" should be more than 10 characters')
    //regex(/^[0-9]{9}[a-z]{1}$/)
    .regex((/^[0-9+]{9}[vV|xX]$/)|(/^[0-9+]{12}$/)) 
    .message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!')*/
    nic: Joi.string().required().label("NIC Number")
    .regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/)
    .message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),  //for new and old nic 
})

module.exports = { LogInInfo, usernameInfo, nicInfo }
