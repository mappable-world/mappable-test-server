import {DataProvider, FeaturesAnswer} from '../interface';
import {Bounds, Feature, LngLat} from '../../lib/geo';
import * as fs from 'fs/promises';
import * as path from 'path';

export class JsonDataProvider implements DataProvider {
    #data: Feature[] = [];
    #isLoading: Promise<void>;

    constructor() {
        this.#isLoading = this.__loadData();
    }

    getFeaturesByBBox(bounds: Bounds, limit: number, page: number = 1): Promise<FeaturesAnswer> {
        const totalResult = this.#data.filter((f) => this.__isPointInsideBounds(f.geometry.coordinates, bounds));

        return Promise.resolve({
            total: totalResult.length,
            features: totalResult.slice((page - 1) * limit, (page - 1) * limit + limit)
        });
    }

    isReady(): Promise<void> {
        return this.#isLoading;
    }

    private async __loadData(): Promise<void> {
        const content = await fs.readFile(path.resolve(__dirname, './data/ne_10m_admin_1_label_points.json'), 'utf-8');
        const data = JSON.parse(content);
        this.#data = data.features as Feature[];
    }

    private __isPointInsideBounds(coordinates: LngLat, [[$1, $2], [$3, $4]]: Bounds): boolean {
        return coordinates[0] >= $1 && coordinates[1] <= $2 && coordinates[0] <= $3 && coordinates[1] >= $4;
    }
}
