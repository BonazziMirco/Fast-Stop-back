const User = require('../models/user');
const Device = require('../models/device');

/**
 * Generic authority check that respects type
 * @param {number} minLevel - Minimum authority required
 * @param {string} requiredType - 'user', 'device', or 'any'
 */
const requireAuthority = (minLevel, requiredType = 'any') => {
    return (req, res, next) => {
        // Get auth info from JWT (set by jwtMiddleware)
        const auth = req.auth;

        if (!auth) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        const { type, authority } = auth;

        // Check type requirement
        if (requiredType !== 'any' && type !== requiredType) {
            return res.status(403).json({
                message: `This endpoint requires ${requiredType} access`,
                currentType: type
            });
        }

        // Check authority level
        if (authority === undefined || authority < minLevel) {
            return res.status(403).json({
                message: 'Insufficient permissions',
                required: minLevel,
                current: authority,
                type: type
            });
        }

        // Attach type to request for easier access
        req.authType = type;
        next();
    };
};

// Specialized middleware for users
const requireUser = (minLevel = User.Authority.DRIVER) => {
    return requireAuthority(minLevel, 'user');
};

// Specialized middleware for devices
const requireDevice = (minLevel) => {
    return requireAuthority(minLevel, 'device');
};

// Convenience middleware for common authority levels
const authMiddleware = {
    // User-specific
    requireAnyUser: requireUser(),
    requireView: requireUser(User.Authority.VIEW_ONLY),
    requireOperator: requireUser(User.Authority.OPERATOR),
    requireAdmin: requireUser(User.Authority.ADMIN),

    // Device-specific
    requireParkometer: requireDevice(Device.Authority.PARKOMETER),
    requireInfoDisplay: requireDevice(Device.Authority.INFO),
    requireCounter: requireDevice(Device.Authority.COUNTER),

    // Generic (checks both type and level)
    requireAuthority
};

module.exports = authMiddleware