const Joi = require('joi')

const stdLoanApprovalInfo = Joi.object().options({ abortEarly: false }).keys({
    approval:Joi.string().valid('accept','reject').label('Approval')
});

const TransactionReportInfo = Joi.object().options({abortEarly: false}).keys({
    start_date:Joi.date().iso(),
    end_date:Joi.date().iso().min(Joi.ref('start_date')).message("Start Date must be less than")
});

module.exports = { stdLoanApprovalInfo, TransactionReportInfo }