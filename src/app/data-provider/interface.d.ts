import type {Bounds} from '../lib/geo';
import type {Feature, Point} from 'geojson';

export type STATUS = 'ready' | 'pending' | 'error';

export interface DataProvider {
    /**
     * Get features by bounds
     */
    getFeaturesByBBox(bounds: Bounds, limits: number, page?: number): Promise<FeaturesAnswer>;

    /**
     * Status of data provider
     */
    readonly status: STATUS;
}

export interface FeaturesAnswer {
    total: number;
    features: Feature<Point>[];
}
