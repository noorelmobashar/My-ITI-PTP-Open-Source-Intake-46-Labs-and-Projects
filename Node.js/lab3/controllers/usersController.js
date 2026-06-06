const userService = require("../services/usersService");
const APIError = require("../utils/APIError");

const createUser = async (req, res) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ message: "user created successfully", data: newUser });
}

const readUsers = async (req, res) => {
    const users = await userService.listUsers();
    res.json({ message: 'users fetched successfully', data: users });
}

const getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
        throw new APIError("user not found", 404);
    }

    res.json({ message: 'user fetched successfully', data: user });
}

const updateUser = async (req, res) => {
    const updateUser = await userService.updateUser(req.params.id, req.body);
    if (!updateUser) {
        throw new APIError("user not found", 404);
    }
    res.json({ message: 'user updated successfully', data: updateUser });
}

const deleteUser = async (req, res) => {
    const deleteUser = await userService.deleteUser(req.params.id);
    if (!deleteUser) {
        throw new APIError("user not found", 404);
    }
    res.json({ message: 'user deleted successfully' });
}

module.exports = {
    createUser,
    readUsers,
    getUserById,
    updateUser,
    deleteUser
}