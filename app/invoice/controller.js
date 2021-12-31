const Invoice = require("./model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");
const { UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getInvoice = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  const subjectInvoice = subject("Invoice", {
    ...invoice,
    user_id: invoice.user._id,
  });

  if (!policy.can("read", subjectInvoice)) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const { order_id } = req.params;

  const invoice = await Invoice.findOne({ order: order_id })
    .populate("order")
    .populate("user");

  res.status(StatusCodes.OK).json({ invoice });
};

module.exports = {
  getInvoice,
};
