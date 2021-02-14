const Joi = require('joi')


const TransactionInfo = Joi.object().options({ abortEarly: false }).keys({
  accNum: Joi.string().regex(/^[0-9]$/).message("Account Number must contain only numbers.").required().label("Account Number"),   //regex added
  amount: Joi.string().regex(/^[0-9]$/).message("Amount must contain only numbers.").required().label("Amount"),
  transaction_type: Joi.string().valid('deposit','withdraw').required()
});

module.exports = { TransactionInfo }