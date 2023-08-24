import express from 'express';
import {pingMiddleware} from './middleware/ping';
import cors from 'cors';
import * as Boom from '@hapi/boom';
import {logger} from './lib/logger';
import {asyncMiddleware} from './lib/async-middlware';
import {loadByBBox} from './middleware/load-by-bbox';
import {loadByTile} from './middleware/load-by-tile';
import {DataProvider} from "./data-provider/interface";
import {apiDocs} from "./middleware/api-docs";
import {versionMiddleware} from "./middleware/version";
import * as process from "process";

export function createApp(dataProvider: DataProvider) {
    const ORIGINS = process.env.ORIGINS ? process.env.ORIGINS.split(' ') : true;

    return (
        express()
            .disable('x-powered-by')
            .disable('etag')
            .use(express.json())
            .get('/version', versionMiddleware)
            .get('/ping', asyncMiddleware(pingMiddleware.bind(null, dataProvider)))
            .use('/v1/api_docs', apiDocs)
            .use(cors({
                origin: ORIGINS,
                methods: ['POST']
            }))
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
            })
    );
}

function sendError(res: express.Response, err: Boom.Boom): void {
    res.status(err.output.statusCode).json(err.output.payload);
}
