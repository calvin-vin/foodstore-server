const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
  deleteAddress,
} = require("./controller");

router.post("/", multer().none(), createDeliveryAddress);
router.get("/", getDeliveryAddress);
router.put("/:id", multer().none(), updateDeliveryAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
