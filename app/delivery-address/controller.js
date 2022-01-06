const DeliveryAddress = require("./model");
const { policyFor } = require("../policy");
const { UnauthenticatedError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { subject } = require("@casl/ability");

const createDeliveryAddress = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("create", "DeliveryAddress")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const user = req.user;
  const address = await DeliveryAddress.create({ ...req.body, user: user._id });

  res.status(StatusCodes.CREATED).json({ address });
};

const getDeliveryAddress = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("view", "DeliveryAddress")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const address = await DeliveryAddress.find({ user: req.user._id });
  res.status(StatusCodes.OK).json({ address });
};

const updateDeliveryAddress = async (req, res) => {
  const { id } = req.params;

  let address = await DeliveryAddress.findOne({ _id: id });
  const subjectAddress = subject("DeliveryAddress", {
    ...address,
    user_id: address.user,
  });

  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("update", subjectAddress)) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  if (!address) throw new NotFoundError(`No Address with id ${id}`);

  address = await DeliveryAddress.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ address });
};

const deleteAddress = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  const { id } = req.params;

  let address = await DeliveryAddress.findOne({ _id: id });
  const subjectAddress = subject("DeliveryAddress", {
    ...address,
    user_id: address.user,
  });

  if (!address) throw new NotFoundError(`No Address with id ${id}`);

  if (!policy.can("delete", subjectAddress)) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  if (!address) throw new NotFoundError(`No Address with id ${id}`);

  await DeliveryAddress.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).send("Address has successfully deleted");
};

module.exports = {
  createDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
  deleteAddress,
};
