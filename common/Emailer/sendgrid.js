const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const hbs = require('nodemailer-handlebars');
const path = require('path');
require('dotenv').config();


/**
 * creates the sendgrid transport
 */
const sendGridTransport = () => {
  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    }),
  );

  const templates = path.join(__dirname, 'templates');

  const options = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: templates,
      partialsDir: templates,
      defaultLayout: '',
    },
    viewPath: templates,
    extName: '.hbs',
  };

  transporter.use('compile', hbs(options));


  return transporter;
};

module.exports = { sendGridTransport };
