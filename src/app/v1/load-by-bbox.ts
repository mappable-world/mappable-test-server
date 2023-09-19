import {Request, Response} from 'express';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError, numericString} from '../lib/zod';

const getBBoxRequestSchema = z
    .object({
        lng1: numericString(z.number()),
        lat1: numericString(z.number()),
        lng2: numericString(z.number()),
        lat2: numericString(z.number()),
        limit: numericString(z.number().int().min(100).default(1000)),
        page: numericString(z.number().int().min(1).default(1))
    })
    .strict();

export async function loadByBBox(req: Request, res: Response): Promise<void> {
    const validationResult = getBBoxRequestSchema.safeParse(req.query);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {lng1, lat1, lng2, lat2, limit, page} = validationResult.data;
    const result = await req.dataProvider.getFeaturesByBBox(
        [
            [lng1, lat1],
            [lng2, lat2]
        ],
        limit,
        page
    );

    res.send({features: result.features, total: +result.total});
}
