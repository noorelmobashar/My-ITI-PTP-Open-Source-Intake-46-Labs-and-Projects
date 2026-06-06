const fs = require("fs").promises;

const readUsers = async () => {
    const data = await fs.readFile('./users.json', 'utf-8');
    return JSON.parse(data);
}

const writeUsers = async (users) => {
    await fs.writeFile('./users.json', JSON.stringify(users));
}

const createUser = async (user) => {
    const users = await readUsers();
    const newUser = {
        id: users.length + 1,
        ...user
    }
    users.push(newUser);
    await writeUsers(users);
    return newUser;
}

const getUserById = async (id) => {
    const users = await readUsers();
    const user = users.find(user => user.id === Number(id));
    return user;
}

const updateUser = async (id, user) => {
    const users = await readUsers();
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
        return null;
    }
    users[userIndex] = {
        ...users[userIndex],
        ...user
    }
    await writeUsers(users);
    return users[userIndex];
}

const deleteUser = async (id) => {
    const users = await readUsers();
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
        return null;
    }
    users.splice(userIndex, 1);
    await writeUsers(users);
    return true;
}

module.exports = {
    readUsers,
    writeUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
}