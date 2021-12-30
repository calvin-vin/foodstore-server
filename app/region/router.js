const express = require("express");
const router = express.Router();

const {
  getAllProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} = require("./controller");

router.get("/provinces", getAllProvinces);
router.get("/regencies", getRegencies);
router.get("/districts", getDistricts);
router.get("/villages", getVillages);

module.exports = router;
