const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: Number,
    items: [
      {
        name: String,
        price: Number,
      },
    ],
    total: Number,
    phone: String,
    address: String,
    status: {
      type: String,
      default: "new", // new | cooking | delivered
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);