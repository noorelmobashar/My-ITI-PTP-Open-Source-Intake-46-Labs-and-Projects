const joi = require("joi");

const bodySchema = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
    user: joi.string().hex().length(24).required()
})

module.exports = {
    body: bodySchema
}