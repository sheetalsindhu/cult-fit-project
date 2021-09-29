const express = require("express");
const router = express.Router();
const Product = require("../models/store.model");


router.post("", async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(201).send({ product });
});

router.get("/", async (req, res) => {
  const product = await Product.find().lean().exec();
  res.render("store", {
      product
  });
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
  return res.status(200).send({ product });
});

module.exports = router;


