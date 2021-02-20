const Joi = require('joi')

const stdLoanApprovalInfo = Joi.object().options({ abortEarly: false }).keys({
    approval:Joi.string().valid('accept','reject').label('Approval')
});

module.exports = { stdLoanApprovalInfo }