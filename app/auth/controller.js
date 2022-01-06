const User = require("./model");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const config = require("../config");
const { getToken } = require("../utils/get-token");

const register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

// authentication process
const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );

    if (!user) return done();

    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());

      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(error, null);
  }

  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (error, user) {
    if (error) {
      return next(error);
    }

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email or password incorrect" });

    const token = jwt.sign(user, config.secretKey, {
      expiresIn: config.secretKeyExpired,
    });
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token } },
      { new: true }
    );

    return res.status(StatusCodes.OK).json({
      message: "logged in successfully",
      user,
      token,
    });
  })(req, res, next);
};

const me = (req, res) => {
  if (!req.user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `You're not logged in or token is expired`,
    });
  }

  res.status(StatusCodes.OK).json({ user: req.user });
};

const logout = async (req, res, next) => {
  const token = getToken(req);

  const user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!user || !token) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `No user found`,
    });
  }

  return res.status(StatusCodes.OK).send("Logged out successfully");
};

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
};
