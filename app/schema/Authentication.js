const Joi = require('joi')

const LogInInfo = Joi.object().options({ abortEarly: false }).keys({
  password: Joi.string().required().label("Password"),
  username: Joi.string().required().label("Username"),
});

const usernameInfo = Joi.object().options({abortEarly:false}).keys({
  username:Joi.string().required().label("Username")
})

const nicInfo = Joi.object().options({abortEarly:false}).keys({
  nic:Joi.string().required().label("NIC Number")
    .min(10)
    .message('"NIC Number" should be more than 10 characters')
    .regex(/^[0-9]{9}[a-z]{1}$/)
    .message('"Contact Number" contains invalid characters')
})

module.exports = { LogInInfo, usernameInfo, nicInfo }