import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

/**
 * Not Found
 * @notFouond Error Handler for Not Found
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
}

/**
 * Error Handler
 */
const errorHandler = (err: ErrorRequestHandler, req:Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.toString()
    });
}

export {notFound, errorHandler};