const joi = require("joi");

const bodySchema = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
}).unknown(false);

module.exports = {
    body: bodySchema
}
