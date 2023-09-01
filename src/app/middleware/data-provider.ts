import {Request} from 'express';
import {DataProvider} from '../data-provider/interface';
import {z} from 'zod';
import {getDataProvider} from '../data-provider';
import * as Boom from '@hapi/boom';
import {formatZodError} from '../lib/zod';
import {config} from '../config';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            dataProvider: DataProvider;
        }
    }
}

const requestSchema = z.object({
    query: z.object({
        provider: z.enum(['db', 'json']).default(config.defaultProvider)
    })
});

export const makeDataProvider = (req: Request) => {
    const validationResult = requestSchema.safeParse(req);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    req.dataProvider = getDataProvider(validationResult.data.query.provider);
};
