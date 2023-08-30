import {DataProvider, type FeaturesAnswer} from '../interface';
import type {Bounds, LngLat} from '../../lib/geo';
import type {Feature, FeatureCollection, Point} from 'geojson';
import * as process from 'process';
import got from 'got';

const DEFAULT_JSON_URL = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson';

export class JsonDataProvider implements DataProvider {
    #data: Feature<Point>[] = [];
    #isLoading: Promise<void>;
    #jsonUrl: string;

    constructor() {
        this.#jsonUrl = process.env.POINTS_JSON || DEFAULT_JSON_URL;
        this.#isLoading = this.__loadData();
    }

    getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        const totalResult = this.#data.filter((f) =>
            this.__isPointInsideBounds(f.geometry.coordinates as LngLat, bounds)
        );

        return Promise.resolve({
            total: totalResult.length,
            features: totalResult.slice((page - 1) * limit, (page - 1) * limit + limit)
        });
    }

    isReady(): Promise<void> {
        return this.#isLoading;
    }

    private async __loadData(): Promise<void> {
        const content = await got(this.#jsonUrl);
        const data = JSON.parse(content.body) as FeatureCollection<Point>;
        this.#data = data.features as Feature<Point>[];
    }

    private __isPointInsideBounds(coordinates: LngLat, [[$1, $2], [$3, $4]]: Bounds): boolean {
        return coordinates[0] >= $1 && coordinates[1] <= $2 && coordinates[0] <= $3 && coordinates[1] >= $4;
    }
}
