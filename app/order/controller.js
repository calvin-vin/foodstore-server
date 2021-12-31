const mongoose = require("mongoose");
const Order = require("./model");
const OrderItem = require("../order-item/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../delivery-address/model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("create", "Order")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const { delivery_fee, delivery_address } = req.body;

  const items = await CartItem.find({ user: req.user._id }).populate("product");

  if (!items && !items.length) {
    throw new BadRequestError(
      "Cannot create order because you have no items in cart"
    );
  }

  const address = await DeliveryAddress.findOne({ _id: delivery_address });

  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    status: "waiting_payment",
    delivery_fee,
    delivery_address: {
      province: address.province,
      regency: address.regency,
      district: address.district,
      village: address.village,
      detail: address.detail,
    },
    user: req.user._id,
  });

  const orderItems = await OrderItem.insertMany(
    items.map((item) => ({
      ...item,
      name: item.product.name,
      qty: parseInt(item.qty),
      price: parseInt(item.product.price),
      order: order._id,
      product: item.product._id,
    }))
  );

  orderItems.forEach((item) => order.order_items.push(item));

  await order.save();

  // clear cart items
  await CartItem.deleteMany({ user: req.user._id });

  res.status(StatusCodes.CREATED).json({ order });
};

const getOrders = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("view", "Order")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = limit * (page - 1);

  const count = await Order.find({ user: req.user._id }).countDocuments();
  const orders = await Order.find({ user: req.user._id })
    .limit(limit)
    .skip(skip)
    .populate("order_items")
    .sort("-createdAt");

  res
    .status(StatusCodes.OK)
    .json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
};

module.exports = {
  createOrder,
  getOrders,
};
