const Product = require("../product/model");
const CartItem = require("../cart-item/model");
const { policyFor } = require("../policy");
const { UnauthenticatedError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const updateCart = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("update", "Cart")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const { items } = req.body;
  const productIds = items.map((item) => item.product._id);
  const products = await Product.find({ _id: { $in: productIds } });

  const cartItems = items.map((item) => {
    const relatedProduct = products.find(
      (product) => product._id.toString() === item.product._id
    );

    return {
      product: relatedProduct._id,
      price: relatedProduct.price,
      image_url: relatedProduct.image_url,
      name: relatedProduct.name,
      user: req.user._id,
      qty: item.qty,
    };
  });

  await CartItem.bulkWrite(
    cartItems.map((item) => {
      return {
        updateOne: {
          filter: { user: req.user._id, product: item.product },
          update: item,
          upsert,
        },
      };
    })
  );
  res.status(StatusCodes.OK).json(cartItems);
};

const getCartItems = async (req, res) => {
  // check policy
  const policy = policyFor(req.user);

  if (!policy.can("read", "Cart")) {
    throw new UnauthenticatedError("You do not have access to this route");
  }

  const items = await CartItem.find({ user: req.user._id }).populate("product");

  res.status(StatusCodes.OK).json({ items });
};

module.exports = {
  updateCart,
  getCartItems,
};
