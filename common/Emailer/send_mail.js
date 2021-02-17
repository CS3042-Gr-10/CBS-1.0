const { sendGridTransport } = require('./sendgrid');

/**
 * The abstract mail sender
 * Free from any implementation logic
 * Change the transporter to include another email API
 * @category Helpers
 * @param {Object} email
 * @param {String} email.from
 * @param {String} email.to
 * @param {String} email.subject
 * @param {String} email.template
 * @param {Object} email.context
 */
const sendMail = async (email) => {
  const transporter = sendGridTransport();
  try {
    await transporter.sendMail(email);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Error during sending mail: ', error);
    console.log(error.response.body.errors)
  }
};

module.exports = sendMail;
