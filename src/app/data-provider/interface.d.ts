import {Bounds, Feature} from '../lib/geo';

export interface DataProvider {
    getFeaturesByBBox(bounds: Bounds, counts: number): Promise<Feature[]>;
    isReady(): Promise<void>;
}
