import {Request, Response, RequestHandler} from 'express';

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void> | void;

/**
 * Converts middleware, which returns promise, to regular `Express` middleware.
 */
export function asyncMiddleware(middleware: AsyncRequestHandler): RequestHandler {
    return (req, res, next): void => {
        Promise.resolve(middleware(req, res)).then(() => {
            if (!res.headersSent) {
                next();
            }
        }, next);
    };
}
