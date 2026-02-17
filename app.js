const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const { expressjwt } = require('express-jwt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./middleware/logger_middleware')
const errorHandler = require('./middleware/error_handling_middleware');
const corsOptions = require('./config/cors');
const securityConfig = require('./config/security');
const authorityMiddleware = require('./middleware/authority_middleware');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const parkingRouter = require('./routes/parkings');
const parkometerRouter = require('./routes/parkometer');
const reportsRouter = require('./routes/reports');
const userManagementRouter = require('./routes/user_management');

const app = express();

// security middleware
app.use(helmet(securityConfig.helmetConfig));
app.use(cors(corsOptions));
app.use('/', securityConfig.limiter);

// request processing middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// logger
app.use(logger);

// swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./docs/swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// routing
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/parking', parkingRouter);
app.use('/parkometer', parkometerRouter);
app.use('/reports', reportsRouter);
app.use('/userManagement', authorityMiddleware.requireAdmin , userManagementRouter);

// error handling
app.use(errorHandler)


module.exports = app;
