import type {DataProvider, FeaturesAnswer} from '../interface';
import type {Feature, Point} from 'geojson';
import type {Bounds} from '../../lib/geo';
import {Pool} from 'pg';
import {config} from '../../config';
import {logger} from '../../lib/logger';

export class DbDataProvider implements DataProvider {
    #db: Pool;

    private constructor() {
        try {
            this.#db = new Pool(config.db);
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }
    async getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        const query = (fields: string) =>
            `select ${fields} from points where ST_Intersects(coordinates, ST_MakeEnvelope($1, $4, $3, $2, 4326))`;

        const [total] = (await this.#db.query(query('count(uid) as cnt'), bounds.flat())).rows;

        const points = await this.#db.query(`${query('uid, feature')} limit $5 offset $6`, [
            ...bounds.flat(),
            limit,
            limit * (page - 1)
        ]);

        return {
            total: +total.cnt,
            features: (points.rows as Array<{feature: Feature<Point>; uid: string}>).map((row) => ({
                id: row.uid,
                ...row.feature
            }))
        };
    }

    static async create(): Promise<DataProvider> {
        const provider = new DbDataProvider();
        await provider.#db.query('select 1');
        return provider;
    }
}
