const mongoose = require("mongoose");

const DeliveryAddressSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [255, "Address cannot be more than 255 characters"],
      required: [true, "Please provide address"],
    },
    village: {
      type: String,
      maxlength: [255, "Village cannot be more than 255 characters"],
      required: [true, "Please provide village"],
    },
    district: {
      type: String,
      maxlength: [255, "District cannot be more than 255 characters"],
      required: [true, "Please provide district"],
    },
    regency: {
      type: String,
      maxlength: [255, "Regency cannot be more than 255 characters"],
      required: [true, "Please provide regency"],
    },
    province: {
      type: String,
      maxlength: [255, "Province cannot be more than 255 characters"],
      required: [true, "Please provide province"],
    },
    detail: {
      type: String,
      maxlength: [1000, "Detail address cannot be more than 1000 characters"],
      required: [true, "Please provide detail address"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryAddress", DeliveryAddressSchema);
