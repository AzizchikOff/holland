const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    orderNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
      {
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["new", "accepted", "cooking", "delivered", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
