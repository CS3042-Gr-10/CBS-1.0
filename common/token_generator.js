const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');



const gen_random_string = (length = 5)=>{
  return cryptoRandomString({length: length});
}

module.exports = {gen_random_string}