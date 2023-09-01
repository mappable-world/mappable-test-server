import express from 'express';
import {pingMiddleware} from './middleware/ping';
import cors from 'cors';
import * as Boom from '@hapi/boom';
import {logger} from './lib/logger';
import {asyncMiddleware} from './lib/async-middlware';
import {versionMiddleware} from './middleware/version';
import {makeDataProvider} from './middleware/data-provider';
import {config} from './config';
import {router as v1} from "./v1";

export function createApp() {
    return (
        express()
            .disable('x-powered-by')
            .disable('etag')
            .use(express.json())
            .use(asyncMiddleware(makeDataProvider))
            .get('/version', versionMiddleware)
            .get('/ping', pingMiddleware)
            .use(cors(config.cors))
            .use('/v1/', v1)
            .use((req: express.Request, res: express.Response, next: express.NextFunction) =>
                next(Boom.notFound('Endpoint not found'))
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .use((err: Error, req: express.Request, res: express.Response, next: unknown) => {
                if (Boom.isBoom(err)) {
                    sendError(res, err);
                } else {
                    logger.error('app', err.stack || err);
                    sendError(res, Boom.internal());
                }
            })
    );
}

function sendError(res: express.Response, err: Boom.Boom): void {
    res.status(err.output.statusCode).json(err.output.payload);
}
