import type { NextFunction, Request, Response } from "express";

/**
 * Not Found
 * @notFouond Error Handler for Not Found
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error Handler
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  const { name, message, ...rest } = err;
  res.json({ status: statusCode, name, message, details: { ...rest } });
};

export { notFound, errorHandler };
