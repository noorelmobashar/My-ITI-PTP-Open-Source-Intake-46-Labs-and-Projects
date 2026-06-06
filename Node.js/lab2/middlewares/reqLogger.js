const reqLogger = (req, res, next) => {
    const { method, url } = req;
    const time = new Date().toISOString();
    console.log(`[${time}] ${method} ${url}`);

    next();
}

module.exports = reqLogger;