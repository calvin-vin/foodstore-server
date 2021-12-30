require("express-async-errors");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

// Routers
const productRouter = require("./app/product/router");
const categoryRouter = require("./app/category/router");
const tagRouter = require("./app/tag/router");
const authRouter = require("./app/auth/router");
const regionRouter = require("./app/region/router");

// defined middlewares
const { decodeToken } = require("./app/auth/middleware");
const notFoundMiddleware = require("./app/middlewares/not-found");
const errorHandlerMiddleware = require("./app/middlewares/error-handler");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(decodeToken());

// Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/region", regionRouter);

// Error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
