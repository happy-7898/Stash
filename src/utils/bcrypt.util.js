const bcrypt = require("bcrypt");

const hashData = async (data) => {
  const saltRounds = 10;

  return await bcrypt.hash(data, saltRounds);
};

const compareData = async (plainData, hashedData) => {
  return await bcrypt.compare(plainData, hashedData);
};

module.exports = {
  hashData,
  compareData,
};
