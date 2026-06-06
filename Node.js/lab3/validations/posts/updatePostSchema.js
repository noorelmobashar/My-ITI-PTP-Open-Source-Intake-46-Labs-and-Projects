const joi = require("joi");

const bodySchema = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
}).unknown(false);

const paramsSchema = joi.object({
    id: joi.string().length(24).hex().required().messages({
        "string.length": "ID must be 24 characters long",
        "string.hex": "ID must be a valid hex string",
    }),
}).unknown(false);

module.exports = {
    body: bodySchema,
    params: paramsSchema,
};