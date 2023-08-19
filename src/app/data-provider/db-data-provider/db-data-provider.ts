import type {DataProvider} from '../interface';
import {Bounds, Feature} from '../../lib/geo';
import {DB} from './pool';
import {logger} from "../../lib/logger";
import {stringifyError} from "../../lib/error-handler";

export class DbDataProvider implements DataProvider {
    async getFeaturesByBBox(bounds: Bounds, counts: number): Promise<Feature[]> {
        const points = await DB.getInstance().query(
            'select json from public.points where coordinates[0] >= $1 and coordinates[1] <= $2 and coordinates[0] <= $3 and coordinates[1] >= $4 limit $5',
            [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], counts]
        );
        return points.rows as Feature[];
    }

    async checkConnection(): Promise<void> {
        try {
            await DB.getInstance().query('select now()');
        } catch(error: unknown) {
            logger.error(stringifyError(error as Error));
            return;
        }
    }
}