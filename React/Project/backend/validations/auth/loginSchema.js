const joi = require("joi");

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).unknown(false);

module.exports = {
    body: schema,
};
