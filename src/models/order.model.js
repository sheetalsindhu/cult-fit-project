const express = require("express");
const app = express();

const mongoose = require("mongoose");
const User = require("./user.models");
const cart = require("./cart.model");


const orderSchema  =  new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref : "user", required : true},
    orders : {type : mongoose.Schema.Types.ObjectId, ref : "cart", required : true}  
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;