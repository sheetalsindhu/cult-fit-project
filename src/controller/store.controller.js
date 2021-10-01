const express = require("express");
const router = express.Router();
const Product = require("../models/store.model");
const WomenProduct = require("../models/women.model")


router.post("", async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(201).send({ product });
});

router.post("/women", async (req, res) => {
  const womenProduct = await WomenProduct.create(req.body);
  return res.status(201).send({ womenProduct });
});


router.get("/", async (req, res) => {
  const product = await Product.find().limit(5).lean().exec();
  const womenProduct = await WomenProduct.find().limit(5).lean().exec();
  res.render("store", {
    product,
    womenProduct,
  });
});

router.delete("/:_id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params._id).lean().exec();
  return res.status(200).send({ product });
});

module.exports = router;


