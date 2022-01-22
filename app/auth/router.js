const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Product = require("../product/model");
const Tag = require("../tag/model");
const Category = require("../category/model");

const { register, login, logout, localStrategy, me } = require("./controller");

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));

router.post("/register", multer().none(), register);
router.post("/login", multer().none(), login);
router.post("/logout", logout);
router.get("/me", me);

router.delete("/all", async (req, res) => {
  await Product.deleteMany({});
  await Tag.deleteMany({});
  await Category.deleteMany({});
  res.send("ok");
});

module.exports = router;
