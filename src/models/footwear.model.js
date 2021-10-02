const mongoose = require("mongoose");

const footwearproductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  size: [{ type: String, required: true }],
  discountPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  description: { type: String, required: true },
  specifications: { type: String, required: true },
  productDetails: [{ type: String, required: true }],
  fabric: [{ type: String, required: true }],
  materialCare: [{ type: String, required: true }],
  mainImg: { type: String, required: true },
  images: [{ type: String, required: true }],
});

const ProductF = mongoose.model("footwearproduct", footwearproductSchema);
module.exports = ProductF;
