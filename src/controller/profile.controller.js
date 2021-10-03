const express = require("express");
const app = express();

const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../models/user.models");
const Cart = require("../models/cart.model")
const Order = require("../models/order.model");


//for login check
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

router.get("/profile", isLoggedIn, async (req, res) => {
  let userId = req.user._id;

  let item = await User.findOne({ _id: userId }).lean().exec();
  console.log(item);
  res.render("./setting/profile", { item });
});


router.get("/order", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  let item = await Order.findOne({ userId }).lean().exec();
  console.log(item.orders);
  res.render("./setting/order", { item });
});

router.get("/subscription", isLoggedIn, (req, res) => {
  res.render("./setting/subscription");
});
router.get("/support", isLoggedIn, (req, res) => {
  res.render("./setting/support");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
router.get("/reedem", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  let item = await Cart.findOne({ userId: userId }).lean().exec();

  res.render("./setting/reedem", { item });
});



module.exports = router;
