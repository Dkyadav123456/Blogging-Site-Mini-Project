/***********************************REQUIRE MONGOOSE LIBARARY*********************************/
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: "firstName is Required",
      trim: true,
    },

    lname: {
      type: String,
      required: "lastName is Required",
      trim: true,
    },

    title: {
      type: String,
      required: "Title is Required",
      enum: ["Mr", "Mrs", "Miss"],
    },

    email: {
      type: String,
      required: "EmailId is FRequired",
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: "Password is Required",
    },
  },
  { timestamps: true }
);

/************************************CONNECTION CREATED***************************************/
module.exports = mongoose.model("Author", authorSchema);
