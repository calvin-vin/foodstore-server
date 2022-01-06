const { getToken } = require("../utils/get-token");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../auth/model");
const { StatusCodes } = require("http-status-codes");

function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretKey);
      const user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Token is expired" });
      }
    } catch (error) {
      if (error && error.name === "JsonWebTokenError") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
        });
      }

      next(error);
    }

    return next();
  };
}

module.exports = { decodeToken };
