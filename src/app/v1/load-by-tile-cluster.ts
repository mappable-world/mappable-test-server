import {Request, Response} from 'express';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError, numericString} from '../lib/zod';
import {Bounds} from '../lib/geo';
import {fromWorldCoordinates, tileToWorld} from '../lib/projection/projection';

const getTileRequestSchema = z
    .object({
        limit: numericString(z.number().int().min(100).max(10000).default(1000)),
        x: numericString(z.number().int()),
        y: numericString(z.number().int()),
        z: numericString(z.number().int())
    })
    .strict();

export async function loadByTileClusterer(req: Request, res: Response): Promise<void> {
    const validationResult = getTileRequestSchema.safeParse(req.query);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {x: tx, y: ty, z: tz, limit} = validationResult.data;

    const bounds: Bounds = tileToWorld(tx, ty, tz).map(fromWorldCoordinates) as Bounds;
    const result = await req.dataProvider.getFeaturesByBBox(bounds, limit);

    if (result.features.length < 2) {
        res.send({
            features: result.features,
            total: result.features.length,
            bounds: bounds
        });
        return;
    }

    const {leftBottom, rightTop} = result.features.reduce(
        (mm, point) => {
            const [lng, lat] = point.geometry.coordinates;
            return {
                leftBottom: [Math.min(mm.leftBottom[0], lng), Math.max(mm.leftBottom[1], lat)],
                rightTop: [Math.max(mm.rightTop[0], lng), Math.min(mm.rightTop[1], lat)]
            };
        },
        {leftBottom: [Infinity, -Infinity], rightTop: [-Infinity, Infinity]}
    );

    res.send({
        features: [
            {
                id: `cluster-${tx}-${ty}-${tz}`,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        (leftBottom[0] + rightTop[0]) / 2,
                        (leftBottom[1] + rightTop[1]) / 2
                    ]
                },
                properties: {
                    count: +result.total,
                    minMax: [leftBottom, rightTop]
                }
            }
        ],

        total: result.total,
        bounds: bounds
    });
}
