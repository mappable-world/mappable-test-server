import express from 'express';
import {pingMiddleware} from './middleware/ping';
import cors from 'cors';
import * as Boom from '@hapi/boom';
import {logger} from './lib/logger';
import {versionMiddleware} from './middleware/version';
import {config} from './config';
import {router as v1} from './v1';
import {DbDataProvider} from './data-provider/db-data-provider/db-data-provider';
import {JsonDataProvider} from './data-provider/json-data-provider/json-data-provider';
import {DataProvider} from './data-provider/interface';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            dataProvider: DataProvider;
        }
    }
}

export async function createApp() {
    const dataProvider =
        config.defaultProvider === 'db' ? await DbDataProvider.create() : await JsonDataProvider.create();

    return (
        express()
            .disable('x-powered-by')
            .disable('etag')
            .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
                req.dataProvider = dataProvider;
                next();
            })
            .use(express.json())
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
