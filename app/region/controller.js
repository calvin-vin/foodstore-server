const csv = require("csvtojson");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

const getAllProvinces = async (req, res) => {
  const data = path.resolve(__dirname, "./data/provinces.csv");

  const provinces = await csv().fromFile(data);
  res.status(StatusCodes.OK).json({ provinces });
};

const getRegencies = async (req, res) => {
  const data = path.resolve(__dirname, "./data/regencies.csv");

  const { province_code } = req.query;
  const regencies = await csv().fromFile(data);

  if (!province_code) return res.status(StatusCodes.OK).json({ regencies });

  const filteredRegencies = regencies.filter(
    (regency) => regency.province_code === province_code
  );
  return res.status(StatusCodes.OK).json({ regencies: filteredRegencies });
};

const getDistricts = async (req, res) => {
  const data = path.resolve(__dirname, "./data/districts.csv");

  const { regency_code } = req.query;
  const districts = await csv().fromFile(data);

  if (!regency_code) return res.status(StatusCodes.OK).json({ districts });

  const filteredDistricts = districts.filter(
    (district) => district.regency_code === regency_code
  );
  return res.status(StatusCodes.OK).json({ districts: filteredDistricts });
};

const getVillages = async (req, res) => {
  const data = path.resolve(__dirname, "./data/villages.csv");

  const { district_code } = req.query;
  const villages = await csv().fromFile(data);

  if (!district_code) return res.status(StatusCodes.OK).json({ villages });

  const filteredVillages = villages.filter(
    (village) => village.district_code === district_code
  );
  return res.status(StatusCodes.OK).json({ villages: filteredVillages });
};

module.exports = {
  getAllProvinces,
  getRegencies,
  getDistricts,
  getVillages,
};
