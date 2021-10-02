const mongoose = require("mongoose");
const product = require("./store.model");
const user = require("./user.models");

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: { type: Number, min: 1, required: true },
      price: { type: Number, required: true },
      name: { type: String, required: true },
      brand: { type: String, required: true },
      image: { type: String, required: true },
      discountPrice: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],
  voucher: { type: Number, required: false },
  address: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
