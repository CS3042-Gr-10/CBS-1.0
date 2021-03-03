const Joi = require('joi')

const stdLoanApprovalInfo = Joi.object().options({ abortEarly: false }).keys({
    approval:Joi.string().valid('accept','reject').label('Approval')
});

const TransactionReportInfo = Joi.object().options({abortEarly: false}).keys({
    branch:Joi.string().required().max(15).label("Branch"),
    start_date:Joi.date().iso().label("Start Date").required(),
    end_date:Joi.date().iso().min(Joi.ref('start_date')).message("Start Date must be earlier than End Date").label("End Date").required()
});

module.exports = { stdLoanApprovalInfo, TransactionReportInfo }