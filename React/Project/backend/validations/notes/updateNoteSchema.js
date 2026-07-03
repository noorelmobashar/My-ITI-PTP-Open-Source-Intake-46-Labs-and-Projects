const joi = require("joi");

const bodySchema = joi.object({
    title: joi.string().min(1).max(200),
    content: joi.string().min(1),
    category: joi.string().valid("personal", "work", "study", "other"),
    tags: joi.alternatives().try(joi.array().items(joi.string()), joi.string()),
    status: joi.string().valid("draft", "published", "archived"),
    isPinned: joi.boolean(),
}).unknown(false);

module.exports = {
    body: bodySchema,
};
