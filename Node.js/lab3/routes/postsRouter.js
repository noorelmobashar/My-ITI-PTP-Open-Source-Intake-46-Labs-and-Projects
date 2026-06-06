const { Router } = require("express");
const postsController = require("../controllers/postsController");
const reqLogger = require("../middlewares/reqLogger");
const validate = require("../middlewares/validate");
const createPostSchema = require("../validations/posts/createPostSchema");
const updatePostSchema = require("../validations/posts/updatePostSchema");

const router = Router();

router.post("/", validate(createPostSchema), reqLogger, postsController.createPost);
router.get("/", postsController.listPosts);
router.get("/:id", postsController.getPostById);
router.patch("/:id", validate(updatePostSchema), postsController.updatePost);
router.delete("/:id", postsController.deletePost);

module.exports = router;