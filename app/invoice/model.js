const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema(
  {
    sub_total: {
      type: Number,
      required: [true, "Please provide sub total"],
    },
    delivery_fee: {
      type: Number,
      required: [true, "Please provide delivery fee"],
    },
    delivery_address: {
      province: {
        type: String,
        required: [true, "Please provide province"],
      },
      regency: {
        type: String,
        required: [true, "Please provide regency"],
      },
      district: {
        type: String,
        required: [true, "Please provide district"],
      },
      village: {
        type: String,
        required: [true, "Please provide village"],
      },
    },
    total: {
      type: Number,
      required: [true, "Please provide total"],
    },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
