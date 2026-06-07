const { Router } = require("express");

const postsController = require("../controllers/postsController");
const { reqLogger, validate, authenticate } = require("../middlewares");
const createPostSchema = require("../validations/posts/createPostSchema");
const updatePostSchema = require("../validations/posts/updatePostSchema");

const router = Router();

router.post("/", authenticate, validate(createPostSchema), reqLogger, postsController.createPost);
router.get("/", authenticate, reqLogger, postsController.listPosts);
router.get("/:id", authenticate, reqLogger, postsController.getPostById);
router.patch("/:id", authenticate, validate(updatePostSchema), reqLogger, postsController.updatePost);
router.delete("/:id", authenticate, reqLogger, postsController.deletePost);

module.exports = router;
