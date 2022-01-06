const Category = require("./model");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, UnauthenticatedError } = require("../errors");
const { policyFor } = require("../policy");

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ categories });
};

const createCategory = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("create", "Category")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const category = await Category.create(req.body);
  res.status(StatusCodes.CREATED).json({ category });
};

const updateCategory = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("update", "Category")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

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
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("deleye", "Category")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

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
