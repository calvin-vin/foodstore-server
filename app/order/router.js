const express = require("express");
const router = express.Router();
const multer = require("multer");

const { createOrder, getOrders } = require("./controller");

router.post("/", multer().none(), createOrder);
router.get("/", getOrders);

module.exports = router;
