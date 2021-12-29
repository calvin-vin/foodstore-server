const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./controller");

router.post("/", multer({ dest: os.tmpdir() }).single("image"), createProduct);
router.get("/", getAllProduct);
router.get("/:id", getProduct);
router.put(
  "/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;
