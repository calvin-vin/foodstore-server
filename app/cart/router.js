const express = require("express");
const router = express.Router();
const multer = require("multer");

const { updateCart, getCartItems } = require("./controller");

router.put("/:id", multer().none(), updateCart);
router.get("/", getCartItems);

module.exports = router;
