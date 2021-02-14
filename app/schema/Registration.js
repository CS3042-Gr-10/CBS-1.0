const Joi = require('joi');


const EmployeeRegistrationInfo = Joi.object().options({ abortEarly: false }).keys({
  //commmon user details
  first_name:Joi.string().required().label("First Name"),
  last_name:Joi.string().required().label("Last Name"),
  name_with_initials:Joi.string().required().label("Name With Initials"),
  email: Joi.string().regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).message('"Email address" consists of invalid characters.').email().max(50).required().label("Email"),
  gender: Joi.string().valid('male','female','other').required().label("Gender"),
  //farmer special
  nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),  //for new and old nic 
   // .min(10) 
   // .message('"NIC Number" should be more than 10 characters')
   // .regex(/^[0-9]{9}[a-z]{1}$/)
   // .message('"Contact Number" contains invalid characters'),
  
   //.regex(/^([0-9+]{9}[vV|xX])|([0-9+]{12})$/) 
    
  contact:Joi.string().trim().required().regex(/^(?:7|0|(?:\+94))[0-9]{9,10}$/).message('number should start with "0","7" or "+94" minimum length must be 9 and mamimum length must be 12'),        //can start with 0,7,+94 can have min 9 max 12
    //.min(7)
    //.message('"Contact Number" must be at least 7 digits')
   // .max(12)
    //.message('"Contact Number" must be maximum 12 digits'),
  postal_code: Joi.string().required().max(8).label("Postal Code")
    .regex(/^\d+$/)
    .message("Postal Code must only contain numbers"),
  age:Joi.number().required(),
  dob: Joi.date().required().label("Date of Birth"),
  add_no: Joi.string().required().max(10).label("Address No"),
  add_street: Joi.string().required().max(256).label("Address Street"),
  add_city: Joi.string().required().max(100).label("Address City"),
 // username: Joi.string().required().min(3).max(15).label("Username"),
  username: Joi.string().alphanum().min(3).message("User name must have minimum 3 characters.").max(15).message("User name must have maximum 30 characters.").required().label("Username"),
  branch: Joi.string().required().max(15).label("Branch"),
  post: Joi.string().required().max(15).label("Employee Level"),
  agree_check: Joi.string().valid('on').required()

});

const CustomerRegistrationGeneralInfo = Joi.object().options({ abortEarly: false }).keys({
  //commmon user details
  first_name:Joi.string().required().label("First Name"),
  last_name:Joi.string().required().label("Last Name"),
  name_with_initials:Joi.string().required().label("Name With Initials"),
  //email: Joi.string().email().max(50).required().label("Email"),
  email: Joi.string().regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).message('"Email address" consists of invalid characters.').email().max(50).required().label("Email"),
  dob: Joi.date().required().label("Date of Birth"),
  age:Joi.number().required(),
  gender: Joi.string().valid('male','female','other').required().label("Gender"),
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
  //farmer special
 /* nic: Joi.string().required().label("NIC Number")
    .min(10)
    .message('"NIC Number" should be more than 10 characters')
    .regex(/^[0-9]{9}[a-z]{1}$/)
    .message('"Contact Number" contains invalid characters'),*/
  //nic: Joi.string().required().label("NIC Number").regex((/^[0-9+]{9}[vV|xX]$/)|(/^[0-9+]{12}$/)).message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),
  nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),
  /*contact:Joi.string().trim().required()
    .min(7)
    .message('"Contact Number" must be at least 7 digits')
    .max(12)
    .message('"Contact Number" must be maximum 12 digits'),*/
  contact:Joi.string().trim().required().regex(/^(?:7|0|(?:\+94))[0-9]{9,10}$/).message('number should start with "0","7" or "+94" minimum length must be 9 and mamimum length must be 12'),        //can start with 0,7,+94 can have min 9 max 12
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