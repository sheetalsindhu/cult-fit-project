const express = require("express");
const app = express();

const mongoose = require("mongoose");
const User = require("./user.models");
const cart = require("./cart.model");


const orderSchema  =  new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref : "user", required : true},
    orders : [] 
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;