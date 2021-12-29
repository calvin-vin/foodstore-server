const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getAllTags, createTag, updateTag, deleteTag } = require("./controller");

router.get("/", getAllTags);
router.post("/", multer().none(), createTag);
router.put("/:id", multer().none(), updateTag);
router.delete("/:id", deleteTag);

module.exports = router;
