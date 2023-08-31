import type {DataProvider, FeaturesAnswer} from '../interface';
import type {Feature, Point} from 'geojson';
import type {Bounds} from '../../lib/geo';
import {DB} from '../../lib/pool';

export class DbDataProvider implements DataProvider {
    async getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        const db = DB.getInstance();
        const query = (fields: string) =>
            `select ${fields} from public.points where ST_MakeEnvelope($1, $2, $3, $4) ~ coordinates`;

        const [total] = (await db.query(`${query('count(uuid) as cnt')} limit $5`, bounds.flat())).rows;

        const points = await db.query(`${query('feature')} limit $5 $6`, [...bounds.flat(), limit, limit * (page - 1)]);

        return {
            total: total.cnt,
            features: points.rows as Feature<Point>[]
        };
    }

    async isReady(): Promise<void> {
        await DB.getInstance().query('select now()');
    }
}
