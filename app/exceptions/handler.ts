import { Request, Response, NextFunction } from 'express'

const app = { inProduction: process.env.NODE_ENV === 'production' }

export default function httpExceptionHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err as any)
  }

  const status =
    err && typeof (err as any).status === 'number' ? (err as any).status : 500
  const message =
    err && typeof (err as any).message === 'string'
      ? (err as any).message
      : 'Internal Server Error'
  const stack =
    !app.inProduction && err && (err as any).stack ? (err as any).stack : undefined

  // Report / log the error (adjust to your logging/monitoring)
  if (!app.inProduction) {
    console.error(err)
  } else {
    // send to monitoring service here
  }

  res.status(status).json({
    error: {
      message,
      ...(stack ? { stack } : {}),
    },
  })
}