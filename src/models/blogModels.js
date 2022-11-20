/***********************************REQUIRE MONGOOSE LIBARARY*********************************/
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Blog title is Required",
      trim: true,
    },
    body: {
      type: String,
      required: "Blog Body is Required",
      trim: true,
    },
    authorId: {
      type: ObjectId,
      trim: true,
      required: "AuthorId is Required",
      ref: "Author",
    },
    tags: {
      type: [String],
      trim: true,
    },

    category: {
      type: [String],
      required: "Blog category is Required",
      trim: true,
    },

    subcategory: {
      type: [String],
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,
    DeletedAt: Date,

    isPublished: {
      type: Boolean,
      default: false,
    },  
  },
  { timestamps: true }
);

/**********************************CONNECTION CREATED***************************************/
module.exports = mongoose.model("blogModel", blogSchema);

