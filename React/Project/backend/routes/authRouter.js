const { Router } = require("express");
const authController = require("../controllers/authController");
const { validate, authenticate, upload } = require("../middlewares");
const registerSchema = require("../validations/auth/registerSchema");
const loginSchema = require("../validations/auth/loginSchema");

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);
router.patch("/me", authenticate, upload.single("profileImage"), authController.updateProfile);

module.exports = router;
