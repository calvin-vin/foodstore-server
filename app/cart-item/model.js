const mongoose = require("mongoose");

const CartItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [5, "Product name must have at least 5 characters"],
      required: [true, "Please provide product name"],
    },
    qty: {
      type: Number,
      min: [1, "Product quantity must have at least 1"],
      required: [true, "Please provide quantity product"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", CartItemSchema);
