const csv = require("csvtojson");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

const getAllProvinces = async (req, res) => {
  const provinces = path.resolve(__dirname, "./data/provinces.csv");

  const data = await csv().fromFile(provinces);
  res.status(StatusCodes.OK).json({ data });
};

const getRegencies = async (req, res) => {
  const regencies = path.resolve(__dirname, "./data/regencies.csv");

  const { province_code } = req.query;
  const data = await csv().fromFile(regencies);

  if (!province_code) return res.status(StatusCodes.OK).json({ data });

  const filteredRegencies = data.filter(
    (regency) => regency.province_code === province_code
  );
  return res.status(StatusCodes.OK).json({ data: filteredRegencies });
};

const getDistricts = async (req, res) => {
  const districts = path.resolve(__dirname, "./data/districts.csv");

  const { regency_code } = req.query;
  const data = await csv().fromFile(districts);

  if (!regency_code) return res.status(StatusCodes.OK).json({ data });

  const filteredDistricts = data.filter(
    (district) => district.regency_code === regency_code
  );
  return res.status(StatusCodes.OK).json({ data: filteredDistricts });
};

const getVillages = async (req, res) => {
  const villages = path.resolve(__dirname, "./data/villages.csv");

  const { district_code } = req.query;
  const data = await csv().fromFile(villages);

  if (!district_code) return res.status(StatusCodes.OK).json({ data });

  const filteredVillages = data.filter(
    (village) => village.district_code === district_code
  );
  return res.status(StatusCodes.OK).json({ data: filteredVillages });
};

module.exports = {
  getAllProvinces,
  getRegencies,
  getDistricts,
  getVillages,
};
