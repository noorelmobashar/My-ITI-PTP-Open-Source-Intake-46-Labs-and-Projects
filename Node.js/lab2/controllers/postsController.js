const postsService = require("../services/postsService");
const ApiError = require("../utils/apiError");

const createPost = async (req, res, next) => {
    try {
        const newPost = await postsService.createPost(req.body);
        res.status(201).json({ message: "post created successfully", data: newPost });
    } catch (err) {
        next(err);
    }
}

const getPosts = async (req, res, next) => {
    try {
        const posts = await postsService.getPosts();
        res.json({ message: 'posts fetched successfully', data: posts });
    } catch (err) {
        next(err);
    }
}

const getPostById = async (req, res, next) => {
    try {
        const post = await postsService.getPostById(req.params.id);

        if (!post) {
            throw new ApiError(404, "post not found");
        }

        res.json({ message: 'post fetched successfully', data: post });
    } catch (err) {
        next(err);
    }
}

const updatePostId = async (req, res, next) => {
    try {
        const updatedPost = await postsService.updatePostId(req.params.id, req.body);

        if (!updatedPost) {
            throw new ApiError(404, "post not found");
        }

        res.json({ message: 'post updated successfully', data: updatedPost });
    } catch (err) {
        next(err);
    }
}

const deletePostId = async (req, res, next) => {
    try {
        const deletedPost = await postsService.deletePostId(req.params.id);

        if (!deletedPost) {
            throw new ApiError(404, "post not found");
        }

        res.json({ message: 'post deleted successfully' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePostId,
    deletePostId
}
