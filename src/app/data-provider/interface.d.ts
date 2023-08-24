import {Bounds, Feature} from '../lib/geo';

export interface DataProvider {
    getFeaturesByBBox(bounds: Bounds, limits: number, page?: number): Promise<FeaturesAnswer>;
    isReady(): Promise<void>;
}

export interface FeaturesAnswer {
    total: number;
    features: Feature[];
}
