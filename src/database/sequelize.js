const { Sequelize } = require("sequelize");
const config = require("../../config/config");

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,
  logging: false,
});

async function connectPostgresDB() {
  try {
    await sequelize.authenticate();
    console.log("Sequelize Db connected successfully");
  } catch (error) {
    console.log("Error while connecting to db", error);
  }
}

module.exports = { sequelize, connectPostgresDB };
