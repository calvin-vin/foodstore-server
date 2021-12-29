const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./controller");

router.get("/", getAllCategories);
router.post("/", multer().none(), createCategory);
router.put("/:id", multer().none(), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
