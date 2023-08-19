import express from 'express';
import {pingMiddleware} from './middleware/ping';
import * as Boom from '@hapi/boom';
import {logger} from './lib/logger';
import {asyncMiddleware} from './lib/async-middlware';
import {loadByBBox} from './middleware/load-by-bbox';
import {DbDataProvider} from './data-provider/db-data-provider/db-data-provider';
import {loadByTile} from './middleware/load-by-tile';

const dataProvider = new DbDataProvider();
export const app = express()
    .disable('x-powered-by')
    .disable('etag')
    .use(express.json())
    .get('/ping', asyncMiddleware(pingMiddleware.bind(null, dataProvider)))
    .post('/v1/bbox', asyncMiddleware(loadByBBox.bind(null, dataProvider)))
    .post('/v1/tile', asyncMiddleware(loadByTile.bind(null, dataProvider)))
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
    });

function sendError(res: express.Response, err: Boom.Boom): void {
    res.status(err.output.statusCode).json(err.output.payload);
}
