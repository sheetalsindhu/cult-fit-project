const express = require("express");
const app = express();
const mongoose = require("mongoose");

const connect = () => {
    return mongoose.connect("mongodb+srv://mansur:cultfit@cluster0.ry92n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
}



module.exports = connect;