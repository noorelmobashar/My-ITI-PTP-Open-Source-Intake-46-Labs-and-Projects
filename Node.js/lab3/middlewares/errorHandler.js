const APIError = require("../utils/APIError");

module.exports = (err, req, res, next) => {
    console.error("❌❌ ", err);

    // mongoose errors
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }

    if (err.code === 11000) {
        const message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, value: ${Object.values(err.keyValue)}`;
        return res.status(400).json({ message });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    // custom errors
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }

    res.status(500).json({ message: "something went wrong" });
}