const { expressjwt: jwt } = require('express-jwt');
const env = require('../config/env');

// Public paths that don't require authentication
const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/device/login',
    '/auth/device/register',
    '/auth/device/refresh',
    '/parking/:zoneId/lots'
];

// Function to get token from request
const getToken = (req) => {
    // Check cookies first
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

// Single JWT middleware that handles both user and device tokens
const jwtMiddleware = jwt({
    secret: (req, token) => {
        // Dynamically choose secret based on token type
        try {
            const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            return decoded.type === 'device'
                ? env.DEVICE_JWT_SECRET
                : env.USER_JWT_SECRET;
        } catch (err) {
            return env.USER_JWT_SECRET; // Fallback
        }
    },
    algorithms: ['HS256'],
    getToken: getToken,
    requestProperty: 'auth' // This puts decoded token in req.auth
}).unless({ path: publicPaths });

// Custom error handler for unauthorized requests
const handleUnauthorized = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: err.message
        });
    }
    next(err);
};

module.exports = {
    jwtMiddleware,
    handleUnauthorized,
    getToken
};