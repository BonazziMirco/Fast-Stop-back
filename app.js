const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
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
const { jwtMiddleware, handleUnauthorized } = require('./middleware/jwt_auth_middleware');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const parkingRouter = require('./routes/parkings');
const reportsRouter = require('./routes/reports');
const userManagementRouter = require('./routes/user_management');

const app = express();

// security middleware
app.use(helmet(securityConfig.helmetConfig));
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
//app.use('/', securityConfig.limiter);

// request processing middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// logger
app.use(logger);

// mount jwt auth middleware (sets req.auth)
app.use(jwtMiddleware);

// swagger documentation
const swaggerFile = require('./docs/swagger.json');

app.use('/api-docs/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// routing
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/parking', parkingRouter);
app.use('/api/reports', authorityMiddleware.requireView, reportsRouter);
app.use('/api/userManagement', authorityMiddleware.requireAdmin , userManagementRouter);

const swaggerDocument = YAML.load('./docs/openApi_documentation.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// error handling
app.use(handleUnauthorized);
app.use(errorHandler);


module.exports = app;
