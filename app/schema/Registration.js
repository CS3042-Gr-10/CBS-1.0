const Joi = require('joi');


const EmployeeRegistrationInfo = Joi.object().options({ abortEarly: false }).keys({
  //commmon user details
  full_name:Joi.string().required().label("Full Name"),
  name_with_initials:Joi.string().required().label("Name With Initials"),
  email: Joi.string().email().max(50).required().label("Email"),
  dob: Joi.date().required().label("Date of Birth"),
  age:Joi.number().required(),
  gender: Joi.string().valid('male','female','other').required().label("Gender"),
  //farmer special
  nic: Joi.string().required().label("NIC Number")
    .min(10)
    .message('"NIC Number" should be more than 10 characters')
    .regex(/^[0-9]{9}[a-z]{1}$/)
    .message('"Contact Number" contains invalid characters'),
  contact:Joi.string().trim().required()
    .length(7, 'utf8')
    .message('"Contact Number" must be 7 digits')
    .regex(/^\d+$/)
    .message('"Contact Number" contains invalid characters'),
  postal_code: Joi.string().required().max(8).label("Postal Code"),
  perm_address: Joi.string().required().max(128).label("Address"),
  username: Joi().string().required().max(15).label("Username"),
  branch: Joi().string().required().max(15).label("Branch"),
  employee_level: Joi.string().valid('employee','manager').required().label("Employee Level"),

});

module.exports = { EmployeeRegistrationInfo };