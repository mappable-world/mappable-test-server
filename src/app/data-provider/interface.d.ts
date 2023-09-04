import type {Bounds} from '../lib/geo';
import type {Feature, Point} from 'geojson';

export interface DataProvider {
    /**
     * Get features by bounds
     */
    getFeaturesByBBox(bounds: Bounds, limits: number, page?: number): Promise<FeaturesAnswer>;
}

export interface FeaturesAnswer {
    total: number;
    features: Feature<Point>[];
}
