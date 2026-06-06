const APIERROR = require("../utils/APIError");
const Post = require("../models/post");

const createPost = async (req, res) => {
    const post = await Post.create(req.body);
    res.status(201).json(post);
}

const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        throw new APIERROR("Post not found", 404);
    }
    res.json(post);
}

const updatePost = async (req, res) => {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
        throw new APIERROR("Post not found", 404);
    }
    res.json(updatedPost);
}

const deletePost = async (req, res) => {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
        throw new APIERROR("Post not found", 404);
    }
    res.json(deletedPost);
}

const listPosts = async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
}

module.exports = {
    createPost,
    getPostById,
    updatePost,
    deletePost,
    listPosts
}