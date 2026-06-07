const APIError = require("../utils/APIError");

const authorizeTo = (role) => {
    return (req, res, next) => {
        if (role !== req.user.role) {
            throw new APIError("Forbidden", 403);
        }
        next();
    }
}

module.exports = authorizeTo;
