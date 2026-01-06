const env = require("./env.config.js");

const config = {
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOST,
  "dialect": env.DB_DIALECT,
  "dialectOptions": env.DB_DIALECTOPTIONS,
};

module.exports = config;
