const nodemailer = require("nodemailer");
require("dotenv").config();

const { PASSWORD, EMAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.office365.com",
  port: 587,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
};

const transpoter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = {
    ...data,
    from: EMAIL,
  };
  await transpoter.sendMail(email);
  return true;
};

module.exports = sendEmail;