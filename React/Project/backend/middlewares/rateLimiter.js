const { rateLimit } = require("express-rate-limit");
const APIError = require("../utils/APIError");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        throw new APIError("Too many requests from this IP, please try again later", 429);
    },
});

module.exports = rateLimiter;
