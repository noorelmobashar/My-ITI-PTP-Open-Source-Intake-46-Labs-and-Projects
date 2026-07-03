const APIError = require("../utils/APIError");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new APIError("Unauthorized", 401);
        const token = authHeader.split(" ")[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secretKey);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new APIError("Unauthorized", 401);
    }
};

module.exports = authenticate;
