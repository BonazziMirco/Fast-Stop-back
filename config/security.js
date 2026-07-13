const rateLimit = require("express-rate-limit");

module.exports = {
    limiter: rateLimit({
        //windowMs: 15 * 60 * 1000, // 15 minutes
        //max: 100, // Max 100 requests per IP
        // with single front-end all requests come from the same ip, even if opened from different devices / people
    }),

    helmetConfig: {
        contentSecurityPolicy: true, // XSS protection
        hsts: { maxAge: 31536000 }, // Force HTTPS
        hidePoweredBy: true, // Hide "Express" header
    },

    passwordPolicy: {
        minLength: 8,
        requireNumbers: true,
    },
};