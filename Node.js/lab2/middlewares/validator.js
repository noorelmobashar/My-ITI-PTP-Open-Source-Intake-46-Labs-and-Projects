const { body, validationResult } = require("express-validator");

const createPostSchema = [
    body("title")
        .notEmpty().withMessage("title is required")
        .isString().withMessage("title must be a string"),
    body("content")
        .notEmpty().withMessage("content is required")
        .isString().withMessage("content must be a string")
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "validation error", errors: errors.array() });
    }
    next();
}

module.exports = {
    createPostSchema,
    validate
}
