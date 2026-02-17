const logger = require('../config/logger');

const httpLogger = (req, res, next) => {
    // Start timer
    const start = Date.now();

    // Log after response
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.ip}`
        );
    });

    next();
};

module.exports = httpLogger;