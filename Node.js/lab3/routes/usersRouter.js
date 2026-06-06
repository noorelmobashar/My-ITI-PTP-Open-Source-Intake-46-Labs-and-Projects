const { Router } = require("express");

const usersController = require("../controllers/usersController");
const reqLogger = require("../middlewares/reqLogger");
const validate = require("../middlewares/validate");
const createUserSchema = require("../validations/users/createUserSchema");
const updateUserSchema = require("../validations/users/updateUserSchema");

const router = Router();

// /users
router.post("/", validate(createUserSchema), reqLogger, usersController.createUser);
router.get("/", usersController.readUsers);
router.get("/:id", usersController.getUserById);
router.patch("/:id", validate(updateUserSchema), usersController.updateUser);
router.delete("/:id", usersController.deleteUser);



module.exports = router;
