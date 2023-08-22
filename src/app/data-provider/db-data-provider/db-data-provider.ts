import type {DataProvider} from '../interface';
import {Bounds, Feature} from '../../lib/geo';
import {DB} from './pool';

export class DbDataProvider implements DataProvider {
    async getFeaturesByBBox(bounds: Bounds, counts: number): Promise<Feature[]> {
        const points = await DB.getInstance().query(
            'select json from public.points where ST_MakeEnvelope($1, $2, $3, $4) ~ coordinates limit $5',
            [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], counts]
        );
        return points.rows as Feature[];
    }

    async isReady(): Promise<void> {
        await DB.getInstance().query('select now()');
    }
}
