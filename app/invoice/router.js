const express = require("express");
const router = express.Router();

const { getInvoice } = require("./controller");

router.get("/", getInvoice);

module.exports = router;
