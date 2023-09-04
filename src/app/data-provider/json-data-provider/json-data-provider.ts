import {DataProvider, type FeaturesAnswer, STATUSES} from '../interface';
import type {Bounds, LngLat} from '../../lib/geo';
import type {Feature, FeatureCollection, Point} from 'geojson';
import got from 'got';
import {config} from '../../config';
import {logger} from '../../lib/logger';
import {statuses} from '../../config/constants';

export class JsonDataProvider implements DataProvider {
    #data: Feature<Point>[] = [];
    #isLoading: Promise<void>;
    #jsonUrl: string;

    #status: STATUSES = statuses.pending;
    get status(): STATUSES {
        return this.#status;
    }

    constructor() {
        this.#jsonUrl = config.pointsImportUrl;
        this.#isLoading = this.__loadData();
    }

    async getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        await this.#isLoading;

        const totalResult = this.#data.filter((f) =>
            this.__isPointInsideBounds(f.geometry.coordinates as LngLat, bounds)
        );

        return Promise.resolve({
            total: totalResult.length,
            features: totalResult.slice((page - 1) * limit, (page - 1) * limit + limit)
        });
    }

    ready(): Promise<void> {
        return this.#isLoading;
    }

    private async __loadData(): Promise<void> {
        try {
            const content = await got(this.#jsonUrl);
            const data = JSON.parse(content.body) as FeatureCollection<Point>;
            this.#data = data.features as Feature<Point>[];
            this.#status = statuses.ready;
        } catch (e) {
            logger.error(e);
            this.#status = statuses.error;
        }
    }

    private __isPointInsideBounds(coordinates: LngLat, [[$1, $2], [$3, $4]]: Bounds): boolean {
        return coordinates[0] >= $1 && coordinates[1] <= $2 && coordinates[0] <= $3 && coordinates[1] >= $4;
    }
}
