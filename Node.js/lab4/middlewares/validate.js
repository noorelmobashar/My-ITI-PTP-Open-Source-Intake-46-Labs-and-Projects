const APIError = require("../utils/APIError");

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            for (const key in schema) {
                const value = await schema[key].validateAsync(req[key]);
                req[key] = value;
            }
            next();
        } catch (error) {
            throw new APIError(error.details[0].message, 400);
        }
    }
}

module.exports = validate;