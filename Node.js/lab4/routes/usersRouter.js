const { Router } = require("express");

const usersController = require("../controllers/usersController");
const { reqLogger, validate, authenticate, authorizeTo } = require("../middlewares");
const { signUpSchema, updateUserSchema, signInSchema } = require("../validations/users");

const router = Router();

// /users
router.post("/sign-up", validate(signUpSchema), reqLogger, usersController.signUp);
router.post("/sign-in", validate(signInSchema), reqLogger, usersController.signIn);
router.get("/", authenticate, authorizeTo("admin"), usersController.readUsers);
router.get("/:id", usersController.getUserById);
router.patch("/:id", validate(updateUserSchema), usersController.updateUser);
router.delete("/:id", usersController.deleteUser);



module.exports = router;
