const Joi = require('joi')

const LogInInfo = Joi.object().options({ abortEarly: false }).keys({
  password: Joi.string().required().label("Password"),
  username: Joi.string().required().label("Username"),
});

module.exports = { LogInInfo }