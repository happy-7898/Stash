const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  "DB_USER": process.env.DB_USER,
  "DB_PASSWORD": process.env.DB_PASSWORD,
  "DB_NAME": process.env.DB_NAME,
  "DB_HOST": process.env.DB_HOST,
  "DB_DIALECT": process.env.DB_DIALECT,
  "DB_DIALECTOPTIONS": {
    "ssl": {
      "require": true,
      "rejectUnauthorized": false,
    },
  },
  "PORT": process.env.PORT || 8000,
  "BREVO_API_KEY": process.env.BREVO_API_KEY,
  "BREVO_SENDER_NAME": process.env.BREVO_SENDER_NAME,
  "BREVO_SENDER_MAIL": process.env.BREVO_SENDER_MAIL,
  "BREVO_OTP_TEMPLATE_ID": process.env.BREVO_OTP_TEMPLATE_ID,
  "ACCESS_TOKEN_SECRET": process.env.ACCESS_TOKEN_SECRET,
  "ACCESS_TOKEN_EXPIRY": process.env.ACCESS_TOKEN_EXPIRY,
  "REFRESH_TOKEN_SECRET": process.env.REFRESH_TOKEN_SECRET,
  "REFRESH_TOKEN_EXPIRY": process.env.REFRESH_TOKEN_EXPIRY,
};
