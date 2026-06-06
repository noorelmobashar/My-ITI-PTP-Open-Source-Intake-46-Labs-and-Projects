const fs = require("fs").promises;

const readPosts = async () => {
    const data = await fs.readFile('./posts.json', 'utf-8');
    return JSON.parse(data);
}

const writePosts = async (posts) => {
    await fs.writeFile('./posts.json', JSON.stringify(posts, null, 2));
}

const createPost = async (post) => {
    const posts = await readPosts();
    const newPost = {
        id: posts.length + 1,
        ...post
    }
    posts.push(newPost);
    await writePosts(posts);
    return newPost;
}

const getPosts = async () => {
    const posts = await readPosts();
    return posts;
}

const getPostById = async (id) => {
    const posts = await readPosts();
    const post = posts.find(post => post.id === Number(id));
    return post;
}

const updatePostId = async (id, post) => {
    const posts = await readPosts();
    const postIndex = posts.findIndex(p => p.id === Number(id));
    if (postIndex === -1) {
        return null;
    }
    posts[postIndex] = {
        ...posts[postIndex],
        ...post
    }
    await writePosts(posts);
    return posts[postIndex];
}

const deletePostId = async (id) => {
    const posts = await readPosts();
    const postIndex = posts.findIndex(p => p.id === Number(id));
    if (postIndex === -1) {
        return null;
    }
    const deletedPost = posts[postIndex];
    posts.splice(postIndex, 1);
    await writePosts(posts);
    return deletedPost;
}

module.exports = {
    readPosts,
    writePosts,
    createPost,
    getPosts,
    getPostById,
    updatePostId,
    deletePostId
}
