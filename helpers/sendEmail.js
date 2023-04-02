const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  console.log('====================================');
  console.log(data);
  console.log('====================================');
  // const email = { ...data, from: "balsunovaanna@gmail.com" };
  try {
    // console.log(email);
    await sgMail.send(data);

    return true;
  } catch (error) {
    throw error();
  }
};

module.exports = sendEmail;

