const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Product name must have at least 3 characters"],
      maxlength: [255, "Product name cannot be more than 255 characters"],
      required: [true, "Please provide product name"],
    },
    description: {
      type: String,
      maxlength: [
        1000,
        "Product description cannot be more than 1000 characters",
      ],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
