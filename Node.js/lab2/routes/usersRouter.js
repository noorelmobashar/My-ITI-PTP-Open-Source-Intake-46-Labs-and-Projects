const { Router } = require("express");

const usersController = require("../controllers/usersController");
const reqLogger = require("../middlewares/reqLogger");

const router = Router();

// /users
router.post("/", usersController.createUser);
router.get("/", usersController.readUsers);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);



module.exports = router;
