const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone_no: { type: Number, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    status: { type: Boolean, required: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("user", UserSchema);

module.exports = User;
