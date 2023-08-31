import type {DataProvider, FeaturesAnswer} from '../interface';
import type {Feature, Point} from 'geojson';
import type {Bounds} from '../../lib/geo';
import {Pool} from 'pg';
import {config} from '../../config';

export class DbDataProvider implements DataProvider {
    async getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        const db = new Pool(config.db);
        const query = (fields: string) =>
            `select ${fields} from points where coordinates && ST_MakeEnvelope($1, $2, $3, $4)`;

        const [total] = (await db.query(query('count(uid) as cnt'), bounds.flat())).rows;

        const points = await db.query(`${query('feature')} limit $5 offset $6`, [
            ...bounds.flat(),
            limit,
            limit * (page - 1)
        ]);

        return {
            total: total.cnt,
            features: points.rows as Feature<Point>[]
        };
    }

    async isReady(): Promise<void> {
        const db = new Pool(config.db);
        await db.query('select now()');
    }
}
