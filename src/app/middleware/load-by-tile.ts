import {Request, Response} from 'express';
import {DataProvider} from '../data-provider/interface';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError} from '../lib/zod-error';
import {Bounds, LngLat} from '../lib/geo';
import {fromWorldCoordinates} from '../lib/projection/projection';

const createTileRequestSchema = z.object({
    body: z
        .object({
            x: z.number(),
            y: z.number(),
            z: z.number()
        })
        .strict()
});

export async function loadByTile(provider: DataProvider, req: Request, res: Response): Promise<void> {
    const validationResult = createTileRequestSchema.safeParse(req);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {x: tx, y: ty, z: tz} = validationResult.data.body;

    const ntiles = 2 ** tz;
    const ts = (1 / ntiles) * 2;

    const x = (tx / ntiles) * 2 - 1;
    const y = -((ty / ntiles) * 2 - 1);

    const coordinates: Bounds = [fromWorldCoordinates({x, y}), fromWorldCoordinates({x: x + ts, y: y - ts})];
    const features = await provider.getFeaturesByBBox(coordinates, 100);

    res.send({features, coordinates, ff: {x, y, tx, ty, tz, ntiles}});
}
