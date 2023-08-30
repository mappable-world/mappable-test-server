import {Request, Response} from 'express';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError} from '../lib/zod-error';

const createBBoxRequestSchema = z.object({
    body: z
        .object({
            limit: z.number().min(100).max(10000).default(1000),
            page: z.number().min(1).max(10000).default(1),
            leftBottom: z.tuple([z.number(), z.number()]),
            rightTop: z.tuple([z.number(), z.number()])
        })
        .strict()
});

export async function loadByBBox(req: Request, res: Response): Promise<void> {
    const validationResult = createBBoxRequestSchema.safeParse(req);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {leftBottom, rightTop, limit, page} = validationResult.data.body;
    const result = await req.dataProvider.getFeaturesByBBox([leftBottom, rightTop], limit, page);

    res.send({features: result.features, total: result.total});
}
