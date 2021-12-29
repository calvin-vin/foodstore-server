const mongoose = require("mongoose");

const { DB_URL } = require("../app/config");

mongoose.connect(DB_URL);

const db = mongoose.connection;

module.exports = db;
