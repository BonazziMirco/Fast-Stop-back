import express from 'express'
const app = express()
const router = express.Router()

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log the error
  console.error(err);

  // Send error response
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
  });
});

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
import cors from 'cors'

// Add CORS middleware
app.use(cors({
  // Configure CORS options as needed
  origin: process.env.NODE_ENV === 'development' ? '*' : process.env.HOST,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
import ForceJsonResponseMiddleware from '#middleware/force_json_response_middleware';
import ContainerBindingsMiddleware from '#middleware/container_bindings_middleware';

const forceJsonResponse = new ForceJsonResponseMiddleware();
const containerBindings = new ContainerBindingsMiddleware();

router.use(
  containerBindings.handle,
  forceJsonResponse.handle,
  express.json()
);

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
// Define middleware functions directly
import { Request, Response, NextFunction } from 'express';

export const middleware = {
  dashboardView: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { default: DashboardViewMiddleware } = await import('#middleware/dashboard_view_middleware');
      const middleware = new DashboardViewMiddleware();
      return middleware.handle(req, res);
    } catch (error) {
      next(error);
    }
  },

  jwtAuth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { default: JwtAuthMiddleware } = await import('#middleware/jwt_auth_middleware');
      const middleware = new JwtAuthMiddleware();
      return middleware.handle(req, res);
    } catch (error) {
      next(error);
    }
  }
};