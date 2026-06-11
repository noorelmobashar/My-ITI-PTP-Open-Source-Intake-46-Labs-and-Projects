class APIError extends Error {
    constructor(
        message,
        statusCode
    ) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor); // to capture the stack trace of the orignal error
    }
}

module.exports = APIError;