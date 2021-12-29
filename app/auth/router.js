const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { register, login, logout, localStrategy, me } = require("./controller");

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));

router.post("/register", multer().none(), register);
router.post("/login", multer().none(), login);
router.post("/logout", logout);
router.get("/me", me);

module.exports = router;
