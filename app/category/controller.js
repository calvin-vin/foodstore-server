const Category = require("./model");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ categories });
};

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(StatusCodes.CREATED).json({ category });
};

const updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new NotFoundError(`No Category with id ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
  const category = await Category.findOneAndDelete({ _id: req.params.id });

  if (!category) {
    throw new NotFoundError(`No Category with id ${req.params.id}`);
  }

  res.status(StatusCodes.OK).send("Category has successfully deleted");
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
