const corsOptions = {
    origin: ['https://fast-stop-front.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: [],
    credentials: true,
    maxAge: 90
};

module.exports = corsOptions;