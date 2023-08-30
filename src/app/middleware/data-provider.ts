import {Request} from 'express';
import {DataProvider} from '../data-provider/interface';
import {z} from 'zod';
import {getDataProvider} from '../data-provider';
import * as Boom from '@hapi/boom';
import {formatZodError} from '../lib/zod-error';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            dataProvider: DataProvider;
        }
    }
}

const requestSchema = z.object({
    query: z
        .object({
            provider: z.enum(['db', 'json']).default((process.env.DATA_PROVIDER as 'db') ?? 'json')
        })
        .strict()
});

export const makeDataProvider = (req: Request) => {
    const validationResult = requestSchema.safeParse(req);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    req.dataProvider = getDataProvider(req.body.provider);
};
