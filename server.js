const express = require("express");
const app = express();
const connect = require("./src/configs/db");
app.use(express.json());

//for authentication process
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../cult-fit-project/src/models/user.models");

/* ___________ ejs connection  ____________ */
app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

//For authentication process
app.use(
  require("express-session")({
    secret: "Any normal Word",
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

// model
const Product = require("../cult-fit-project/src/models/store.model");
const WomenProduct = require("../cult-fit-project/src/models/women.model");
const FootwearProduct = require("../cult-fit-project/src/models/footwear.model");
const Cart = require("../cult-fit-project/src/models/cart.model");
const Order = require("../cult-fit-project/src/models/order.model")

/* ___________ Controllers ____________ */
const storeController = require("./src/controller/store.controller");
const cartController = require("./src/controller/cart.controller");
const profileController = require("./src/controller/profile.controller");

app.get("/", (req, res) => {
  res.render("index");
});

/* ___________ store page to cultsport page  ____________ */
app.get("/store/cultsport/:_id", async (req, res) => {
  const product = await Product.find({ _id: req.params._id }).lean().exec();
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

app.post("/store/women", async (req, res) => {
  const womenProduct = await WomenProduct.create(req.body);
  return res.status(201).send({ womenProduct });
});

app.post("/store/footwear", async (req, res) => {
  const footwearproduct = await FootwearProduct.create(req.body);
  return res.status(201).send({ footwearproduct });
});
/* ___________ store page to mens page  ____________ */
app.get("/store/women", async (req, res) => {
  const product = await WomenProduct.find().lean().exec();
  res.render("women", {
    product,
  });
});

app.get("/store/footwear", async (req, res) => {
  const product = await FootwearProduct.find().lean().exec();
  res.render("footwear", {
    product,
  });
});


/* ___________ mens page to cultsport page  ____________ */
app.get("/store/mens/cultsport/:_id", async (req, res) => {
  const product = await Product.find({ _id: req.params._id }).lean().exec();
  res.render("cultsport", {
    product,
  });
});

/* ___________ women page to cultsport page  ____________ */
app.get("/store/women/cultsport/:_id", async (req, res) => {
  const product = await WomenProduct.find({ _id: req.params._id })
    .lean()
    .exec();
  return res.render("cultsport", {
    product,
  });
});


/* ___________ footwear page to cultsport page  ____________ */
app.get("/store/footwear/cultsport/:_id", async (req, res) => {
  const product = await FootwearProduct.find({ _id: req.params._id })
    .lean()
    .exec();
  return res.render("cultsport", {
    product,
  });
});


/* ___________ cart to payment ____________ */
app.get("/payment", async (req, res) => {
  res.render("payment");
});

/* ___________  payment to thanks ____________ */
app.get("/thankyou", async (req, res) => {
  res.render("thankyou");
});

app.get("/live", (req, res) => {
  res.render("live");
});

app.get("/mind", (req, res) => {
  res.render("mind");
});

app.get("/cult", (req, res) => {
  res.render("cult");
});

app.get("/care", (req, res) => {
  res.render("care");
});

//user authentication required
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/userprofile", isLoggedIn, (req, res) => {
  // console.log(req.user._id);
  res.render("cart");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      phone_no: req.body.phone_no,
      password: req.body.password,
      gender: req.body.gender,
      age: req.body.age,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        // console.log(err);
        res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // console.log(req.user._id);
    return next();
  }
  res.redirect("/");
}

app.get("/cart/product/minus/:ad", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  let productd = req.params.ad;
  let cart = await Cart.findOne({ userId });
  if (cart) {
    let index = cart.products.findIndex((p) => p._id == productd);
    if (index > -1) {
      let productItem = cart.products[index];
      productItem.quantity = productItem.quantity - 1;
      cart.products[index] = productItem;
    }
    await cart.save();
  }
  return res.redirect("/cart/");
});

app.get("/cart/plus/quantity/:cd", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  let productI = req.params.cd;
  let cart = await Cart.findOne({ userId });

  if (cart) {
    let index = cart.products.findIndex((p) => p._id == productI);
    if (index > -1) {
      let productItem = cart.products[index];
      productItem.quantity = productItem.quantity + 1;
      cart.products[index] = productItem;
    }
    await cart.save();
  }
  return res.redirect("/cart/");
});

app.post("/cart/delete/product/:id", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  let productId = req.params.id;
  const cart = await Cart.findOne({ userId: userId });
  if (cart) {
    let index = cart.products.findIndex((p) => p._id == productId);
    cart.products.splice(index, 1);
    await cart.save();
  }
  return res.redirect("/cart/");
});

app.post("/voucher", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const { voucher } = req.body;
  const cart = await Cart.findOne({ userId });
  if (cart) {
    if (voucher == "masai30") {
      cart.voucher = 200;
    } else if (voucher == "masai20") {
      cart.voucher = 300;
    }
    await cart.save();
    return res.redirect("./reedem");
  }
});

app.post("/address", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const { address } = req.body;
  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.address = address;
    await cart.save();
    return res.redirect("./cart");
  }
});

app.get("/orders", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.products.splice(0, cart.products.length);
    await cart.save();
    return res.redirect("/thankyou");
  }
});

app.get("/store/w_cultsport/:_id", async (req, res) => {
  const product = await WomenProduct.find({ _id: req.params._id })
    .lean()
    .exec();
  res.render("cultsport", {
    product,
  });
});

app.get("/store/f_cultsport/:_id", async (req, res) => {
  const product = await FootwearProduct.find({ _id: req.params._id })
    .lean()
    .exec();
  res.render("cultsport", {
    product,
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/orders", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.body.orders;
  console.log(orderId);
  let order = await Order.findOne({ userId });
  if (order) {
    // let index = order.orders.findIndex(p = p.product == orderId);
    order.orders = orderId;
    order = await order.save();
  } else {
    const neworder = await Order.create({ userId, order });
    // res.redirect("/cart");
  }
});


app.get("/orders", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  const order = await Order.findOne({ userId });
  if (cart) {
    let c = cart.products.splice(0, cart.products.length);

    if (order) {
      order.orders.push(c);
    } else {
      let newOrder = await Order.create({ userId, orders: [c] });
    }

    await order.save();
    await cart.save();
    return res.redirect("/thankyou");
  }
});

/* ___________ return api requests ____________ */
app.use("/store", storeController);
app.use("/cart", cartController);
app.use("", profileController);

app.listen(3000, async () => {
  await connect();
  console.log("Listening on port 3000");
});
