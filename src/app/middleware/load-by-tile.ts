import {Request, Response} from 'express';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError} from '../lib/zod-error';
import {Bounds} from '../lib/geo';
import {fromWorldCoordinates, tileToWorld} from '../lib/projection/projection';

const createTileRequestSchema = z.object({
    body: z
        .object({
            limit: z.number().min(100).max(10000).default(1000),
            x: z.number().min(0),
            y: z.number().min(0),
            z: z.number().min(0)
        })
        .strict()
});

export async function loadByTile(req: Request, res: Response): Promise<void> {
    const validationResult = createTileRequestSchema.safeParse(req);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {x: tx, y: ty, z: tz, limit} = validationResult.data.body;

    const coordinates: Bounds = tileToWorld(tx, ty, tz).map(fromWorldCoordinates) as Bounds;
    const result = await req.dataProvider.getFeaturesByBBox(coordinates, limit);

    res.send({features: result.features, total: result.total, bounds: coordinates});
}
