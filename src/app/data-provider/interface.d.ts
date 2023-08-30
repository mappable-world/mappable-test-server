import type {Bounds} from '../lib/geo';
import type {Feature, Point} from 'geojson';

export interface DataProvider {
    getFeaturesByBBox(bounds: Bounds, limits: number, page?: number): Promise<FeaturesAnswer>;
    isReady(): Promise<void>;
}

export interface FeaturesAnswer {
    total: number;
    features: Feature<Point>[];
}
