const Joi = require('joi')

const startFDInfo = Joi.object().options({ abortEarly: false }).keys({
    saving_no:Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),
    fd_plan:Joi.string().valid('1','2','3','4','5').required(),
    username:Joi.string().alphanum().min(3).message("User name must have minimum 3 characters.").max(15).message("User name must have maximum 30 characters.").required().label("Username"),
    amount:Joi.number().required().label("Initial Amount"),
    agree_check: Joi.string().valid('on').required(),
});


const transferInfo = Joi.object().options({ abortEarly: false }).keys({
    savings_no:Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),
    receiving_acc_no:Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),
    amount:Joi.number().required().label("Initial Amount"),
});

const onlineLoanIndividualInfo = Joi.object().options({abortEarly:false}).keys({
//    nic: Joi.string().required().label("NIC Number").regex(/^[0-9+]{9}[vV|xX]|[0-9+]{12}$/).message('"NIC" should have 9 digits with "V"/"X" or 12 digits only!'),
    amount: Joi.string().label("Amount").regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Amount must contain only numbers and must be less than 4 decimal places."),
    loan_plan: Joi.string().required().max(15).label("Loan Plan"),
    purpose: Joi.string().valid("Business Loan","Vehicle Loan","House Loan"),
    agree_check: Joi.string().valid('on').required(),
    fd_acc:Joi.string().required(),
});

const onlineLoanOrganizationInfo = Joi.object().options({abortEarly:false}).keys({
//    org_id: Joi.string().required().label("Organization Number"),
    amount: Joi.string().label("Amount").regex(/^[0-9]{1,12}[.]?[0-9]{0,4}$/).message("Amount must contain only numbers and must be less than 4 decimal places."),
    loan_plan: Joi.string().required().max(15).label("Loan Plan"),
    agree_check: Joi.string().valid('on').required(),
    fd_acc:Joi.string().regex(/^[0-9]{1,10}$/).message("Account Number must contain only numbers.").required().label("Account Number"),
});

module.exports = {startFDInfo, transferInfo, onlineLoanIndividualInfo, onlineLoanOrganizationInfo}