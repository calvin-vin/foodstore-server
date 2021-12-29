const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  DB_URL: process.env.MONGO_URI,
  rootPath: path.resolve(__dirname, ".."),
  secretKey: process.env.SECRET_KEY,
  secretKeyExpired: process.env.SECRET_KEY_EXPIRED,
};
