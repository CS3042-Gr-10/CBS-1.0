const Joi = require('joi')

const startFDInfo = Joi.object().options({ abortEarly: false }).keys({
    saving_no:Joi.string().required(),
    fd_plan:Joi.string().valid('1','2','3','4','5').required(),
    username:Joi.string().alphanum().min(3).message("User name must have minimum 3 characters.").max(15).message("User name must have maximum 30 characters.").required().label("Username"),
    amount:Joi.number().required().label("Initial Amount"),
    agree_check: Joi.string().valid('on').required(),
});


const transferInfo = Joi.object().options({ abortEarly: false }).keys({
    saving_no:Joi.string().required(),
    receiving_acc_no:Joi.string().required(),
    amount:Joi.number().required().label("Initial Amount"),
});

module.exports = {startFDInfo, transferInfo}