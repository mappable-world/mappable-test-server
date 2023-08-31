import express from 'express';
import {pingMiddleware} from './middleware/ping';
import cors from 'cors';
import * as Boom from '@hapi/boom';
import {logger} from './lib/logger';
import {asyncMiddleware} from './lib/async-middlware';
import {loadByBBox} from './middleware/load-by-bbox';
import {loadByTile} from './middleware/load-by-tile';
import {apiDocs} from './middleware/api-docs';
import {versionMiddleware} from './middleware/version';
import * as process from 'process';
import {makeDataProvider} from './middleware/data-provider';
import {config} from './config';

export function createApp() {
    return (
        express()
            .disable('x-powered-by')
            .disable('etag')
            .use(express.json())
            .use(asyncMiddleware(makeDataProvider))
            .get('/version', versionMiddleware)
            .get('/ping', pingMiddleware)
            .use('/v1/api_docs', apiDocs)
            .use(cors(config.cors))
            .post('/v1/bbox', asyncMiddleware(loadByBBox))
            .post('/v1/tile', asyncMiddleware(loadByTile))
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
