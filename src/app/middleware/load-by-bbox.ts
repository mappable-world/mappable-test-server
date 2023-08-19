import {Request, Response} from 'express';
import {DataProvider} from '../data-provider/interface';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError} from '../lib/zod-error';

const createBBoxRequestSchema = z.object({
    body: z
        .object({
            leftBottom: z.tuple([z.number(), z.number()]),
            rightTop: z.tuple([z.number(), z.number()])
        })
        .strict()
});

export async function loadByBBox(provider: DataProvider, req: Request, res: Response): Promise<void> {
    const validationResult = createBBoxRequestSchema.safeParse(req);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {leftBottom, rightTop} = validationResult.data.body;
    const features = await provider.getFeaturesByBBox([leftBottom, rightTop], 100);

    res.send({features});
}
