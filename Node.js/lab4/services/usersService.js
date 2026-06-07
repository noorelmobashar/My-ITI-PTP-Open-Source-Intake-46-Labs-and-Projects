const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const jwtSign = promisify(jwt.sign);

const signUp = async (user) => {
    // hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const mappedUser = {
        ...user,
        dateOfBirth: new Date(user.dateOfBirth),
        password: hashedPassword
    }
    const newUser = await User.create(mappedUser);
    return newUser;
}

const getUserById = async (id) => {
    const user = await User.findOne({ _id: id });
    // const user = await User.findById(id);
    return user;
}

const updateUser = async (id, user) => {
    const updatedUser = await User.findOneAndUpdate({ _id: id }, user, { new: true });
    // const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
}

const deleteUser = async (id) => {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
}

const listUsers = async () => {
    const users = await User.find();
    return users;
}


const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateToken = async (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    const secretKey = process.env.JWT_SECRET;
    const options = {
        expiresIn: '1h'
    }

    return jwtSign(payload, secretKey, options);
}

module.exports = {
    signUp,
    getUserById,
    updateUser,
    deleteUser,
    listUsers,
    getUserByEmail,
    comparePasswords,
    generateToken
}
