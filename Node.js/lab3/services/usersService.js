const User = require("../models/users");

const createUser = async (user) => {
    console.log(user);
    const mappedUser = {
        ...user,
        dateOfBirth: new Date(user.dateOfBirth)
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

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    listUsers
}