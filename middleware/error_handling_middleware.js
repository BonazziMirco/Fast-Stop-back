const logger = require('../config/logger');

class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Prepare error context for logging
    const errorContext = {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        userId: req.user?.id,
        ip: req.ip,
        errorName: err.name,
        stack: err.stack
    };


    // Handle Sequelize specific errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        err.statusCode = 409;
        err.message = 'Resource already exists';
        logger.warn('Database constraint violation:', errorContext);
    } else if (err.name === 'SequelizeValidationError') {
        err.statusCode = 400;
        err.message = err.errors.map(e => e.message).join(', ');
        logger.warn('Validation error:', errorContext);
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        err.statusCode = 400;
        err.message = 'Invalid reference to a related resource';
        logger.warn('Foreign key constraint error:', errorContext);
    }

    // Handle JWT errors
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        err.statusCode = 401;
        err.message = 'Invalid token';
        logger.warn('Authentication error:', errorContext);
    }

    // Handle other errors
    else if (err.statusCode >= 500) {
        logger.error('Server error:', errorContext);
    } else {
        logger.warn('Client error:', errorContext);
    }


    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    AppError,
    errorHandler
};