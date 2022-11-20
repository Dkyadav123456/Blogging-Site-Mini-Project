/***********************************REQUIRE LIBARARY AND FILES********************************/
const blogModel = require("../models/blogModels");
const authorModel = require("../models/authorModels");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

/**************************************VALIDATION*********************************************/
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};


/***************************************CREATE BLOG*******************************************/
const createBlog = async function (req, res) {
  try {
    let data = req.body; //DATA  COME FROM BODY

    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please Provide Valid Blog Details" });

    if (!isValid(data.title))
      return res.status(400).send({ status: false, msg: "Title is Required" });

    if (!isValid(data.body))
      return res.status(400).send({ status: false, msg: "Body is Required" });

    if (!isValid(data.authorId))
      return res.status(400).send({ status: false, msg: "AuthorId is Required" });

    if (!mongoose.isValidObjectId(data.authorId))
      return res.status(400).send({ status: false, msg: "Enter a Valid AuthorId" });

    let AuthorData = await authorModel.findById(data.authorId);

    if (!AuthorData)
      return res.status(404).send({ status: false, msg: "No such authorId found" });

    if (!isValid(data.category))
      return res.status(400).send({ status: false, msg: "Category is Required" });

    let category = data.category.split(",").map((x) => x.trim());
    data.category = category;

    if (!isValidString(data.subcategory))
      return res.status(400).send({ status: false, msg: "SubCategory is Required" });
    if (data.subcategory) {
      let subcategory = data.subcategory.split(",").map((x) => x.trim());
      data.subcategory = subcategory;
    }

    if (!isValidString(data.tags))
      return res.status(400).send({ status: false, msg: "tags is Required" });
    if (data.tags) {
      let tags = data.tags.split(",").map((x) => x.trim());
      data.tags = tags;
    }

    let checkBlog = await blogModel.findOne(data);

    if (checkBlog)
      return res.status(400).send({ status: false, msg: "Blog already exists" });

    if (data.isPublished) data.publishedAt = new Date();

    let blogCreate = await blogModel.create(data);

    res.status(201).send({status: true,msg: "Blog Created Sucessfully",data: blogCreate,});
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


/*************************************GET BLOG DATA*******************************************/
const getSpecificAllBlogs = async function (req, res) {
  try {
    let data = req.query;

    if (!isValidString(data.authorId))
      return res.status(400).send({ status: false, msg: "AuthorId is Required" });
    if (data.authorId) {
      if (!mongoose.isValidObjectId(data.authorId))
        return res.status(400).send({ status: false, msg: "Enter a Valid AuthorId" });

      let AuthorData = await authorModel.findById(data.authorId);

      if (!AuthorData)
        return res.status(404).send({ status: false, msg: "No such authorId found" });
    }

    if (!isValidString(data.category))
      return res.status(400).send({ status: false, msg: "category is Required" });
    if (data.category) {
      let category = data.category.split(",").map((x) => x.trim());
      data.category = category;
    }

    if (!isValidString(data.subcategory))
      return res.status(400).send({ status: false, msg: "subcategory is Required" });
    if (data.subcategory) {
      let subcategory = data.subcategory.split(",").map((x) => x.trim());
      data.subcategory = subcategory;
    }

    if (!isValidString(data.tags))
      return res.status(400).send({ status: false, msg: "tags is Required" });
    if (data.tags) {
      let tags = data.tags.split(",").map((x) => x.trim());
      data.tags = tags;
    }

    let blogData = await blogModel.find({ $and: [data, { isDeleted: false }, { isPublished: true }] }).populate("authorId");

    if (!blogData.length)
      return res.status(400).send({ status: false, msg: "No such blog exists" });

    res.status(200).send({ status: true, data: blogData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


/*************************************UPDATE BLOG*********************************************/
const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    let blog_Id = req.params.blogId;

    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "input can't be empty" });

    if (!isValidString(data.title))
      return res.status(400).send({ status: false, msg: "tags is Required" });

    if (!isValidString(data.body))
      return res.status(400).send({ status: false, msg: "body is Required" });

    if (!isValidString(data.subcategory))
      return res.status(400).send({ status: false, msg: "SubCategory is Required" });
    if (data.subcategory) {
      let subcategory = data.subcategory.split(",").map((x) => x.trim());
      data.subcategory = subcategory;
    }

    if (!isValidString(data.tags))
      return res.status(400).send({ status: false, msg: "tags is Required" });
    if (data.tags) {
      let tags = data.tags.split(",").map((x) => x.trim());
      data.tags = tags;
    }

    let checkBlog = await blogModel.findById(blog_Id);

    if (!checkBlog)
      return res.status(404).send({ status: false, msg: "Blog Not Found" });

    if (checkBlog.isDeleted == true)
      return res.status(400).send({ status: false, msg: "This blog is already Deleted" });

    let update = await blogModel.findByIdAndUpdate(
      blog_Id,

      {
        $push: { tags: data.tags, subcategory: data.subcategory },
        title: data.title,
        body: data.body,
        isPublished: true,
        publishedAt: new Date(),
      },

      { new: true }
    );

    res.status(200).send({ status: true, data: update });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


/*********************************DELETBLOG BY PATH PARAM ID***********************************/
const deleteBlog = async function (req, res) {
  try {
    let blog_Id = req.params.blogId;

    let checkBlog = await blogModel.findById(blog_Id);

    if (!checkBlog)
      return res.status(404).send({ status: false, msg: "Blog Not Found" });

    if (checkBlog.isDeleted == true)
      return res.status(400).send({ status: false, msg: "this blog is already deleted" });

    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blog_Id },

      { $set: { isDeleted: true, DeletedAt: Date.now() } },

      { new: true }
    );

    if (deletedBlog.modifiedCount == 0)
      return res.status(400).send({ status: false, msg: "No Blog Document Exists" });

    res.status(200).send({ status: true, data: deletedBlog });
  } catch (err) {
    res.status(500).send({ msg: "error", error: err.message });
  }
};

/*********************************DELETBLOG BY QUERY PARAMS***********************************/
const deleteparams = async function (req, res) {
  try {
    let data = req.query;

    const deleteByQuery = await blogModel.updateMany(
      { $and: [data, { isDeleted: false }] },

      { $set: { isDeleted: true, DeletedAt: new Date() } },

      { new: true }
    );

    if (deleteByQuery.modifiedCount == 0)
      return res.status(400).send({ status: false, msg: "The Blog is already Deleted" });

    res.status(200).send({ status: true, msg: deleteByQuery });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/********************************PUBLICALLY IN METHODS**************************************/
module.exports = {createBlog,getSpecificAllBlogs,updateBlog,deleteBlog,deleteparams,};
