import type {Bounds} from '../lib/geo';
import type {Feature, Point} from 'geojson';

export type STATUSES = 'ready' | 'pending' | 'error';

export interface DataProvider {
    getFeaturesByBBox(bounds: Bounds, limits: number, page?: number): Promise<FeaturesAnswer>;

    /**
     * Check if data provider is ready to work
     */
    readonly status: STATUSES;
}

export interface FeaturesAnswer {
    total: number;
    features: Feature<Point>[];
}
