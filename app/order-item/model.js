const mongoose = require("mongoose");

const OrderItemSchema = mongoose.Schema(
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
      required: [true, "Please provide price product"],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);
