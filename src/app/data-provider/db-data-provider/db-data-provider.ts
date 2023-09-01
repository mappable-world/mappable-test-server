import type {DataProvider, FeaturesAnswer} from '../interface';
import type {Feature, Point} from 'geojson';
import type {Bounds} from '../../lib/geo';
import {Pool} from 'pg';
import {config} from '../../config';

export class DbDataProvider implements DataProvider {
    #db: Pool;

    constructor() {
        this.#db = new Pool(config.db);
    }
    async getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        const query = (fields: string) =>
            `select ${fields} from points where coordinates && ST_MakeEnvelope($1, $2, $3, $4)`;

        const [total] = (await this.#db.query(query('count(uid) as cnt'), bounds.flat())).rows;

        const points = await this.#db.query(`${query('feature')} limit $5 offset $6`, [
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
        await this.#db.query('select now()');
    }
}
