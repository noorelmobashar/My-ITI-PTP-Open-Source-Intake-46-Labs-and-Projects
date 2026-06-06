const { Router } = require("express");

const postsController = require("../controllers/postsController");
const validator = require("../middlewares/validator");

const router = Router();

// /posts
router.post("/", validator.createPostSchema, validator.validate, postsController.createPost);
router.get("/", postsController.getPosts);
router.get("/:id", postsController.getPostById);
router.put("/:id", postsController.updatePostId);
router.delete("/:id", postsController.deletePostId);

module.exports = router;
