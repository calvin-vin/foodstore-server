const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.plugin(AutoIncrement, { inc_field: "order_number" });

OrderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce((total, item) => {
    return total + parseInt(item.qty);
  }, 0);
});

module.exports = mongoose.model("Order", OrderSchema);
