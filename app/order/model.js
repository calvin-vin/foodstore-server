const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Invoice = require("../invoice/model");

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

OrderSchema.post("save", async function () {
  const sub_total = this.order_items.reduce(
    (sum, item) => (sum += item.price * item.qty),
    0
  );

  const invoice = await Invoice.create({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  });
});

module.exports = mongoose.model("Order", OrderSchema);
