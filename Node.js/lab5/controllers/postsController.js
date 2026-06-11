const Post = require("../models/post");
const postsService = require("../services/postsService");
const APIError = require("../utils/APIError");

const createPost = async (req, res) => {
    const postData = { ...req.body, user: req.user.id };
    const post = await postsService.createPost(postData);
    res.status(201).json(post);
}

const getPostById = async (req, res) => {
    const post = await postsService.getPostById(req.params.id);
    if (!post) {
        throw new APIError("Post not found", 404);
    }
    const result = {
        ...post.toObject(),
        isOwnedByCurrentUser: post.user.toString() === req.user.id
    };
    res.json(result);
}

const updatePost = async (req, res) => {
    const post = await postsService.getPostById(req.params.id);
    if (!post) {
        throw new APIError("Post not found", 404);
    }
    if (post.user.toString() !== req.user.id) {
        throw new APIError("You can only edit your own posts", 403);
    }
    const updatedPost = await postsService.updatePost(req.params.id, req.body);
    res.json(updatedPost);
}

const deletePost = async (req, res) => {
    const post = await postsService.getPostById(req.params.id);
    if (!post) {
        throw new APIError("Post not found", 404);
    }
    if (post.user.toString() !== req.user.id) {
        throw new APIError("You can only delete your own posts", 403);
    }
    const deletedPost = await postsService.deletePost(req.params.id);
    res.json(deletedPost);
}

const listPosts = async (req, res) => {
    const posts = await postsService.listPosts();
    const postsWithFlag = posts.map(post => ({
        ...post.toObject(),
        isOwnedByCurrentUser: post.user.toString() === req.user.id
    }));
    res.json(postsWithFlag);
}

module.exports = {
    createPost,
    getPostById,
    updatePost,
    deletePost,
    listPosts
}
