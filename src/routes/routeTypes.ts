import { Request, Response, NextFunction } from 'express';

/**
 * Middleware type to define express middleware request types.
 * 
 * @typedef
 * @name ExpressMiddleware
 * @kind variable
 * @exports
 */
export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

declare module 'express' {
  interface Request {
    parsedData?: unknown; // todo: add schema types
  }
}
