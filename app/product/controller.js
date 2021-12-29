const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const { policyFor } = require("../policy");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");

const getAllProduct = async (req, res) => {
  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = limit * (page - 1);

  // filtering
  const criteria = {};
  const name = req.query.name || "";
  if (name.length) {
    criteria.name = {
      $regex: `${name}`,
      $options: "i",
    };
  }

  const category = req.query.category || "";
  if (category.length) {
    const inCategory = await Category.findOne({
      name: { $regex: `${category}`, $options: "i" },
    });

    if (inCategory) {
      criteria.category = inCategory._id;
    }
  }

  const tags = req.query.tags || [];
  if (tags.length) {
    const inTags = await Tag.find({ name: { $in: tags } });
    criteria.tags = { $in: inTags.map((tag) => tag._id) };
  }

  const countProduct = await Product.find({ criteria }).countDocuments();

  const products = await Product.find(criteria)
    .limit(limit)
    .skip(skip)
    .populate("category")
    .populate("tags");
  res.status(StatusCodes.OK).json({ products, count: countProduct });
};

const getProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    throw new NotFoundError(`No Product with id ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res, next) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("create", "Product")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const payload = req.body;

  // check category
  if (payload.category) {
    const category = await Category.findOne({
      name: { $regex: payload.category, $options: "i" },
    });

    if (category) {
      payload.category = category._id;
    } else {
      delete payload.category;
    }
  }

  // check tags
  if (payload.tags && payload.tags.length) {
    const tags = await Tag.find({ name: { $in: payload.tags } });

    if (tags.length) {
      payload.tags = tags.map((tag) => tag._id);
    }
  }

  if (req.file) {
    const tmp_path = req.file.path;
    const originalExt =
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];

    // check file format
    const prohibitedExt = ["jpg", "jpeg", "jfif", "png"];
    if (!prohibitedExt.includes(originalExt)) {
      throw new BadRequestError("File is not image");
    }

    // check file size
    const maxSize = 1000000;
    if (req.file.size > maxSize) {
      throw new BadRequestError("File size cannot be more than 1Mb");
    }

    const filename = req.file.filename + "." + originalExt;
    const target_path = path.resolve(
      config.rootPath,
      `public/upload/${filename}`
    );

    // read temp file
    const src = fs.createReadStream(tmp_path);
    // move to permanent location
    const dest = fs.createWriteStream(target_path);
    // start moving file from `src` to `dest`
    src.pipe(dest);

    src.on("end", async () => {
      try {
        const product = await Product.create({
          ...payload,
          image_url: filename,
        });
        res.status(StatusCodes.CREATED).json({ product });
      } catch (error) {
        // if there's error remove uploaded file
        fs.unlinkSync(target_path);
        if (error && error.name === "ValidationError") {
          throw new BadRequestError("Failed upload image");
        }
        next(error);
      }
    });

    src.on("error", async () => {
      next(error);
    });
  } else {
    const product = await Product.create({ ...payload });
    res.status(StatusCodes.CREATED).json({ product });
  }
};

const updateProduct = async (req, res, next) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("update", "Product")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const payload = req.body;

  const { price, category } = payload;
  if (price === "" || category === "") {
    throw new BadRequestError(
      "Name, price, and category fields cannot be empty"
    );
  }

  // check category
  if (payload.category) {
    const category = await Category.findOne({
      name: { $regex: payload.category, $options: "i" },
    });

    if (category) {
      payload.category = category._id;
    } else {
      delete payload.category;
    }
  }

  // check tags
  if (payload.tags && payload.tags.length) {
    const tags = await Tag.find({ name: { $in: payload.tags } });

    if (tags.length) {
      payload.tags = tags.map((tag) => tag._id);
    }
  }

  if (req.file) {
    const tmp_path = req.file.path;
    const originalExt =
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];

    // check file format
    const prohibitedExt = ["jpg", "jpeg", "jfif", "png"];
    if (!prohibitedExt.includes(originalExt)) {
      throw new BadRequestError("File is not image");
    }

    // check file size
    const maxSize = 1000000;
    if (req.file.size > maxSize) {
      throw new BadRequestError("File size cannot be more than 1Mb");
    }

    const filename = req.file.filename + "." + originalExt;
    const target_path = path.resolve(
      config.rootPath,
      `public/upload/${filename}`
    );

    // read temp file
    const src = fs.createReadStream(tmp_path);
    // move to permanent location
    const dest = fs.createWriteStream(target_path);
    // start moving file from `src` to `dest`
    src.pipe(dest);

    src.on("end", async () => {
      try {
        let product = await Product.findOne({ _id: req.params.id });
        // get current image path
        const currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        // check if image is exist
        if (fs.existsSync(currentImage)) {
          // delete image if it is exist
          fs.unlinkSync(currentImage);
        }

        product = await Product.findOneAndUpdate(
          { _id: req.params.id },
          { ...payload, image_url: filename },
          { new: true, runValidators: true }
        );

        res.status(StatusCodes.OK).json({ product });
      } catch (error) {
        // if there's error remove uploaded file
        fs.unlinkSync(target_path);
        if (error && error.name === "ValidationError") {
          throw new BadRequestError("Failed upload image");
        }

        next(error);
      }
    });

    src.on("error", async () => {
      next(error);
    });
  } else {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(StatusCodes.OK).json({ product });
  }
};

const deleteProduct = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("delete", "Product")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const product = await Product.findByIdAndDelete({ _id: req.params.id });

  if (!product) {
    throw new NotFoundError(`No Job with id ${req.params.id}`);
  }

  let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
  if (fs.existsSync(currentImage)) {
    fs.unlinkSync(currentImage);
  }

  res.status(StatusCodes.OK).send("Product has successfully deleted");
};

module.exports = {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
