import express from 'express';
import {pingMiddleware} from './middleware/ping';
import * as Boom from '@hapi/boom';
import {logger} from "./lib/logger";
import {asyncMiddleware} from "./lib/async-middlware";

export const app = express()
    .disable('x-powered-by')
    .disable('etag')
    .get('/ping', asyncMiddleware(pingMiddleware))
    .use(express.json())
    .use((req: express.Request, res: express.Response, next: express.NextFunction) => next(Boom.notFound('Endpoint not found')))
    .use((err: Error, req: express.Request, res: express.Response) => {
        console.log('dddd', err);

        if (Boom.isBoom(err)) {

            sendError(res, err);
        } else {
            logger.error('app', err.stack || err);
            sendError(res, Boom.internal());
        }
    })

function sendError(res: express.Response, err: Boom.Boom): void {
    res.status(err.output.statusCode).json(err.output.payload);
}
