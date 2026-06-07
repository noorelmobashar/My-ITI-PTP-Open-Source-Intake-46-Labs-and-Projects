const userService = require("../services/usersService");
const APIError = require("../utils/APIError");

const signUp = async (req, res) => {
    // check if email exists or not
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
        throw new APIError("user already exists", 400);
    }
    // create new user with hashed password
    const newUser = await userService.signUp(req.body);

    res.status(201).json({ message: "user created successfully", data: newUser });
}

const signIn = async (req, res) => {
    // check if user exists
    const user = await userService.getUserByEmail(req.body.email);
    if (!user) {
        throw new APIError("Invalid email and password combination", 401);
    }
    // compare passwords
    const isPasswordsMatch = await userService.comparePasswords(req.body.password, user.password);
    if (!isPasswordsMatch) {
        throw new APIError("Invalid email and password combination", 401);
    }

    // generate token
    const token = await userService.generateToken(user);

    res.status(200).json({ message: "user signed in successfully", data: { token } });
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
    signUp,
    readUsers,
    getUserById,
    updateUser,
    deleteUser,
    signIn
}