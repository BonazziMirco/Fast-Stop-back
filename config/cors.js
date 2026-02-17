const corsOptions = {
    // TODO change the origin to the actual frontend URL when deploying
    origin: ['https://citium.fiatlinux.it', 'http://localhost:5173'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: true,
    exposedHeaders: [],
    credentials: true,
    maxAge: 90
};

module.exports = corsOptions;