const express = require("express");
const app = express();
const connect = require("./src/configs/db");
app.use(express.json());

/* ___________ ejs connection  ____________ */
app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

const Product = require("../cult-fit-project/src/models/store.model");

/* ___________ Controllers ____________ */
const storeController = require("./src/controller/store.controller");

/* ___________ home page  ____________ */
app.get("/", (req, res) => {
  res.render("index");
});

/* ___________ store page to cultsport page  ____________ */
app.get("/store/cultsport/:id", async (req, res) => {
  const product = await Product.find({ id: req.params.id }).lean().exec();
  res.render("cultsport", {
    product,
  });
});

/* ___________ store page to mens page  ____________ */
app.get("/store/mens", async (req, res) => {
  const product = await Product.find().lean().exec();
  res.render("mens", {
    product,
  });
});

/* ___________ return api requests ____________ */
app.use("/store", storeController);

app.listen(3000, async () => {
  await connect();
  console.log("Listening on port 3000");
});
