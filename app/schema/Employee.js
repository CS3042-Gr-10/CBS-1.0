const Joi = require('joi')


const TransactionInfo = Joi.object().options({ abortEarly: false }).keys({
  accNum: Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),   //regex added
  amount: Joi.string().regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Amount must contain only numbers.").required().label("Amount"),
  transaction_type: Joi.string().valid('deposit','withdraw').required()
});

const accountNumberInfo = Joi.object().options({abortEarly:false}).keys({
  accNum: Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),   //regex added
  customer_type:Joi.string().valid("customer","organization").label("Customer Type")
});

const customerLoanInfo = Joi.object().options({abortEarly:false}).keys({
  nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[v|x]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "v"/"x"(simple characters) or 12 digits only!'),
  //nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "v"/"x"(simple characters) or 12 digits only!'),
  income: Joi.string().label("Income").regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Income must contain only numbers and must be less than 4 decimal places."),
  amount: Joi.string().label("Amount").regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Amount must contain only numbers and must be less than 4 decimal places."),
  loan_plan: Joi.string().required().max(15).label("Loan Plan"),
  purpose: Joi.string().valid("Business Loan","Vehicle Loan","House Loan"),
  branch: Joi.string().required().max(15).label("Branch"),
  agree_check: Joi.string().valid('on').required(),
});

const organizationLoanInfo = Joi.object().options({abortEarly:false}).keys({
  org_id: Joi.string().required().label("Organization Number"),
  income: Joi.string().label("Income").regex(/^[0-9]{1,12}$/).message("Income must contain only numbers."),
  amount: Joi.string().label("Amount").regex(/^[0-9]{1,12}$/).message("Amount must contain only numbers."),
  loan_plan: Joi.string().required().max(15).label("Loan Plan"),
  branch: Joi.string().required().max(15).label("Branch"),
  agree_check: Joi.string().valid('on').required(),
});

const IndividualSavingsInfo = Joi.object().options({abortEarly:false}).keys({
  nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[v|x]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "v"/"x"(simple characters) or 12 digits only!'),
  init_amount:Joi.number().required().label("Initial Amount"),
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
  savings_plan:Joi.string().valid('1','2','3','4','5','6','7','8').required(),
  branch:Joi.string().required().max(15).label("Branch"),
  agree_check:Joi.string().valid('on').required(),

})

const IndividualCurrentInfo = Joi.object().options({abortEarly:false}).keys({
  nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[v|x]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "v"/"x"(simple characters) or 12 digits only!'),
  init_amount:Joi.number().required().label("Initial Amount"),
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
  branch:Joi.string().required().max(15).label("Branch"),
  agree_check:Joi.string().valid('on').required(),
})

const OrganizationSavingsInfo = Joi.object().options({abortEarly:false}).keys({
  org_id:Joi.string().required().label("Organization Number"),
  init_amount:Joi.number().required().label("Initial Amount"),
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
  savings_plan:Joi.string().valid('1','2','3','4','5','6','7','8').required(),
  branch:Joi.string().required().max(15).label("Branch"),
  agree_check:Joi.string().valid('on').required(),

})

const OrganizationCurrentInfo = Joi.object().options({abortEarly:false}).keys({
  org_id:Joi.string().required().label("Organization Number"),
  init_amount:Joi.number().required().label("Initial Amount"),
  acc_type:Joi.string().valid('savings','current').required().label("Account Type"),
  branch:Joi.string().required().max(15).label("Branch"),
  agree_check:Joi.string().valid('on').required(),
});

const payLoanTnfo = Joi.object().options({abortEarly:false}).keys({
  loan_id:Joi.string().regex(/^[0-9]{1,12}$/).label("Loan Id")
})

module.exports = { TransactionInfo,accountNumberInfo, customerLoanInfo, organizationLoanInfo, IndividualSavingsInfo ,IndividualCurrentInfo,OrganizationCurrentInfo,OrganizationSavingsInfo, payLoanTnfo}