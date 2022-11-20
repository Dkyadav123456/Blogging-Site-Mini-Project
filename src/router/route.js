/**********************************REQUIRE LIBARARY AND FILE**********************************/
const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController");
const blogController = require("../controller/blogController");
const middleWare = require("../middleware/authentication");

/**********************************UNPROTECTED API********************************************/
router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.login);

/**********************************PROTECTED API**********************************************/
router.post("/blogs", middleWare.authentication, blogController.createBlog);
router.get("/blogs",middleWare.authentication,blogController.getSpecificAllBlogs);
router.put("/blog/:blogId",middleWare.authorization,blogController.updateBlog);
router.delete("/blogs/:blogId",middleWare.authorization,blogController.deleteBlog);
router.delete("/blogs", middleWare.authorization, blogController.deleteparams);

/***************************************It is Router******************************************/
module.exports = router;
