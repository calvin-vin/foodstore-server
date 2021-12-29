const Tag = require("./model");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getAllTags = async (req, res) => {
  const tags = await Tag.find({});
  res.status(StatusCodes.OK).json({ tags });
};

const createTag = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("create", "Tag")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const tag = await Tag.create(req.body);
  res.status(StatusCodes.CREATED).json({ tag });
};

const updateTag = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("update", "Tag")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const tag = await Tag.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tag) {
    throw new NotFoundError(`No Tag with id ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ tag });
};

const deleteTag = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("delete", "Tag")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const tag = await Tag.findOneAndDelete({ _id: req.params.id });

  if (!tag) {
    throw new NotFoundError(`No Tag with id ${req.params.id}`);
  }

  res.status(StatusCodes.OK).send("Tag has successfully deleted");
};

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};
