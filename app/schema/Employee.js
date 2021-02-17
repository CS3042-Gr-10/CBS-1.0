const Joi = require('joi')


const TransactionInfo = Joi.object().options({ abortEarly: false }).keys({
  accNum: Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),   //regex added
  amount: Joi.string().regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Amount must contain only numbers.").required().label("Amount"),
  transaction_type: Joi.string().valid('deposit','withdraw').required()
});

const accountNumberInfo = Joi.object().options({abortEarly:false}).keys({
  accNum: Joi.string().regex(/^[0-9]$/).message("Account Number must contain only numbers.").required().label("Account Number"),   //regex added
  customer_type:Joi.string().valid("customer","organization").label("Customer Type")
});

const customerLoanInfo = Joi.object().options({abortEarly:false}).keys({
  nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),
  income: Joi.string().label("Income").regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Income must contain only numbers and must be less than 4 decimal places."),
  amount: Joi.string().label("Amount").regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Amount must contain only numbers and must be less than 4 decimal places."),
  interest: Joi.string().label("Income").regex(/^[0-9]{1,2}[.]?[0-9]{0,2}$/).message("percentage must be in the format XX.XX"),
  purpose: Joi.string().valid("Business Loan","Vehicle Loan","House Loan"),
  branch: Joi.string().required().max(15).label("Branch"),
  time:Joi.string().required().regex(/^[0-9]{1,12}$/).message("No of months must contain only numbers."),
  agree_check: Joi.string().valid('on').required(),
});

const organizationLoanInfo = Joi.object().options({abortEarly:false}).keys({
  org_id: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),
  income: Joi.string().label("Income").regex(/^[0-9]{1,12}$/).message("Income must contain only numbers."),
  amount: Joi.string().label("Amount").regex(/^[0-9]{1,12}$/).message("Amount must contain only numbers."),
  interest: Joi.string().label("Income").regex(/^[0-9]{1,2}[.]?[0-9]{0,2}$/).message("percentage must be in the format XX.XX"),
  branch: Joi.string().required().max(15).label("Branch"),
  time:Joi.string().required().regex(/^[0-9]{1,12}$/).message("No of months must contain only numbers."),
  agree_check: Joi.string().valid('on').required(),
});

module.exports = { TransactionInfo,accountNumberInfo, customerLoanInfo, organizationLoanInfo}