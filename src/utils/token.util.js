const jwt = require("jsonwebtoken");
const env = require("../../config/env.config");

const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
