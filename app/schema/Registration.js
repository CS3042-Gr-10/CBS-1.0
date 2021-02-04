const Joi = require('joi');


const EmployeeRegistrationInfo = Joi.object().options({ abortEarly: false }).keys({
  //commmon user details
  first_name:Joi.string().required().label("First Name"),
  last_name:Joi.string().required().label("Last Name"),
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
    .min(7)
    .message('"Contact Number" must be at least 7 digits')
    .max(12)
    .message('"Contact Number" must be maximum 12 digits'),
  postal_code: Joi.string().required().max(8).label("Postal Code")
    .regex(/^\d+$/)
    .message("Postal Code must only contain numbers"),
  add_no: Joi.string().required().max(10).label("Address No"),
  add_street: Joi.string().required().max(256).label("Address Street"),
  add_city: Joi.string().required().max(100).label("Address City"),
  username: Joi.string().required().max(15).label("Username"),
  branch: Joi.string().required().max(15).label("Branch"),
  employee_level: Joi.string().valid('employee','manager').required().label("Employee Level"),
  agree_check: Joi.string().valid('on').required()

});

const CustomerRegistrationInfo = Joi.object().options({ abortEarly: false }).keys({
  //commmon user details
  full_name:Joi.string().required().label("Full Name"),
  name_with_initials:Joi.string().required().label("Name With Initials"),
  email: Joi.string().email().max(50).required().label("Email"),
  dob: Joi.date().required().label("Date of Birth"),
  gender: Joi.string().valid('male','female','other').required().label("Gender"),
  //farmer special
  nic: Joi.string().required().label("NIC Number")
    .min(10)
    .message('"NIC Number" should be more than 10 characters')
    .regex(/^[0-9]{9}[a-z]{1}$/)
    .message('"Contact Number" contains invalid characters'),
  contact:Joi.string().trim().required()
    .min(7)
    .message('"Contact Number" must be at least 7 digits')
    .max(12)
    .message('"Contact Number" must be maximum 12 digits'),
  postal_code: Joi.string().required().max(8).label("Postal Code")
    .regex(/^\d+$/)
    .message("Postal Code must only contain numbers"),
  perm_address: Joi.string().required().max(128).label("Address"),
  username: Joi.string().required().max(15).label("Username"),
  branch: Joi.string().required().max(15).label("Branch"),
  employee_level: Joi.string().valid('employee','manager').required().label("Employee Level"),
  agree_check: Joi.string().valid('on').required()

});

module.exports = { CustomerRegistrationInfo , EmployeeRegistrationInfo };