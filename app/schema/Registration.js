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
  post: Joi.string().required().max(15).label("Employee Level"),
  agree_check: Joi.string().valid('on').required()

});

const CustomerRegistrationGeneralInfo = Joi.object().options({ abortEarly: false }).keys({
  //commmon user details
  first_name:Joi.string().required().label("First Name"),
  last_name:Joi.string().required().label("Last Name"),
  name_with_initials:Joi.string().required().label("Name With Initials"),
  email: Joi.string().email().max(50).required().label("Email"),
  dob: Joi.date().required().label("Date of Birth"),
  age:Joi.number().required(),
  gender: Joi.string().valid('male','female','other').required().label("Gender"),
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
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
  branch: Joi.string().required().max(15).label("Branch"),
  agree_check: Joi.string().valid('on').required(),
  init_amount:Joi.number().required().label("Initial Amount"),
});

const CustomerRegistrationSavingsInfo = Joi.object().options({ abortEarly: false }).keys({
  savings_plan:Joi.string().valid('1','2','3','4').required(),
});

const CustomerRegistrationCurrentInfo = Joi.object().options({ abortEarly: false }).keys({
  income_details:Joi.allow(null),
});

const ExistingCustomerAccountInfo = Joi.object().options({abortEarly:false}).keys({
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
  init_amount:Joi.number().required().label("Initial Amount"),
  branch: Joi.string().required().max(15).label("Branch"),
  agree_check: Joi.string().valid('on').required()
})

module.exports = { CustomerRegistrationGeneralInfo,CustomerRegistrationCurrentInfo, CustomerRegistrationSavingsInfo , EmployeeRegistrationInfo, ExistingCustomerAccountInfo };