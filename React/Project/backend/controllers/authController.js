const authService = require("../services/authService");
const APIError = require("../utils/APIError");

const register = async (req, res) => {
    const user = await authService.getUserByEmail(req.body.email);
    if (user) {
        throw new APIError("User already exists", 400);
    }
    const newUser = await authService.signUp(req.body);
    const token = await authService.generateToken(newUser);
    res.status(201).json({ message: "User created successfully", data: { token } });
};

const login = async (req, res) => {
    const user = await authService.getUserByEmail(req.body.email);
    if (!user) {
        throw new APIError("Invalid email and password combination", 401);
    }
    const isPasswordsMatch = await authService.comparePasswords(req.body.password, user.password);
    if (!isPasswordsMatch) {
        throw new APIError("Invalid email and password combination", 401);
    }
    const token = await authService.generateToken(user);
    res.status(200).json({ message: "User signed in successfully", data: { token } });
};

const getMe = async (req, res) => {
    const user = await authService.getUserById(req.user.id);
    if (!user) {
        throw new APIError("User not found", 404);
    }
    res.json({ message: "User fetched successfully", data: user });
};

const updateProfile = async (req, res) => {
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;
    const updatedUser = await authService.updateUser(req.user.id, updateData);
    if (!updatedUser) {
        throw new APIError("User not found", 404);
    }
    res.json({ message: "Profile updated successfully", data: updatedUser });
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile
};
