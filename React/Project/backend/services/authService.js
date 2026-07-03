const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const jwtSign = promisify(jwt.sign);

const signUp = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const mappedUser = {
        ...userData,
        password: hashedPassword
    };
    const newUser = await User.create(mappedUser);
    return newUser;
};

const getUserById = async (id) => {
    const user = await User.findById(id).select("-password");
    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = async (user) => {
    const payload = {
        id: user._id,
        email: user.email
    };
    const secretKey = process.env.JWT_SECRET;
    const options = {
        expiresIn: "7d"
    };
    return jwtSign(payload, secretKey, options);
};

const updateUser = async (id, data) => {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
    return updatedUser;
};

module.exports = {
    signUp,
    getUserById,
    getUserByEmail,
    comparePasswords,
    generateToken,
    updateUser
};
