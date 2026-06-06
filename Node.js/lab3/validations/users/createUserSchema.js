const joi = require("joi");

const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/).required().messages({
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    }),
    confirmPassword: joi.valid(joi.ref('password')).required().messages({
        "any.only": "Passwords must match"
    }),
    dateOfBirth: joi.date().required(),
}).unknown(false);

module.exports = {
    body: schema,
    // query: joi.object({}).unknown(false),
    // params: joi.object({}).unknown(false),
    // headers: joi.object({}).unknown(false),
};
