export type Feature = {
    type: 'Feature';
    properties: {
        OBJECTID_1: number;
        diss_me: number;
        adm1_code: string;
        sr_sov_a3: string;
        sr_adm0_a3: string;
        sr_gu_a3: string;
        iso_a2: string;
        adm0_sr: number;
        name?: string;
        admin: string;
        scalerank: number;
        datarank: number;
        featureclass: string;
    };
    geometry: {type: 'Point'; coordinates: LngLat};
};

export type LngLat = [number, number];
export interface Point {
    x: number;
    y: number;
}

export type Bounds = [LngLat, LngLat];
