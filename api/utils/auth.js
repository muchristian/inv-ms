const jwt = require("jsonwebtoken");
const omit = require("lodash.omit");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (data, expire = "5m") => {
  const tokenData = omit(data, "password");
  const token = jwt.sign(tokenData, "jwt_secret_key", {
    expiresIn: `${expire}`,
  });
  return token;
};
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
};

module.exports = { generateToken, verifyToken };
