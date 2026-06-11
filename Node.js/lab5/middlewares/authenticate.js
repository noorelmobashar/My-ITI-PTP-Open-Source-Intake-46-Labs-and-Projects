const APIError = require("../utils/APIError");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        // extract token from headers
        const authHeader = req.headers.authorization; // "Bearer <token>"
        if (!authHeader) throw new APIError("Unauthorized", 401);
        const token = authHeader.split(" ")[1];
        // decrypt and verify the token 
        const secretKey = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secretKey);
        // from decrypted payload attach user to request
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new APIError("Unauthorized", 401);
    }
}

module.exports = authenticate;