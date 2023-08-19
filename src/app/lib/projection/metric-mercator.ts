import {LngLat, Point} from '../geo';
import {cycleRestrict, RAD_TO_DEG} from './restrict';

class MetricMercator {
    private _e2: number;
    private _e4: number;
    private _e6: number;
    private _e8: number;
    private _d2: number;
    private _d4: number;
    private _d6: number;
    private _d8: number;
    private _subradius: number;

    readonly radius: number;
    readonly e: number;

    constructor(radius = 6378137, e = 0.0818191908426) {
        this.radius = radius;
        this.e = e;

        // Even degrees of eccentricity
        this._e2 = this.e * this.e;
        this._e4 = this._e2 * this._e2;
        this._e6 = this._e4 * this._e2;
        this._e8 = this._e4 * this._e4;
        this._subradius = 1 / radius;

        // Precomputed Coefficients for the Fast Inverse Mercator Transform
        // See here for more details: http://mercator.myzen.co.uk/mercator.pdf formula 6.52
        // Works only with small values of eccentricity!
        this._d2 = this._e2 / 2 + (5 * this._e4) / 24 + this._e6 / 12 + (13 * this._e8) / 360;
        this._d4 = (7 * this._e4) / 48 + (29 * this._e6) / 240 + (811 * this._e8) / 11520;
        this._d6 = (7 * this._e6) / 120 + (81 * this._e8) / 1120;
        this._d8 = (4279 * this._e8) / 161280;
    }

    mercatorToGeo(coords: Point): LngLat {
        const lng = this.xToLongitude(coords.x);
        const lat = this.yToLatitude(coords.y);
        return [lng, lat];
    }

    xToLongitude(x: number): number {
        return RAD_TO_DEG * cycleRestrict(x * this._subradius, -Math.PI, Math.PI);
    }

    yToLatitude(y: number): number {
        const xphi = Math.PI * 0.5 - 2 * Math.atan(1 / Math.exp(y * this._subradius));
        const latitude =
            xphi +
            this._d2 * Math.sin(2 * xphi) +
            this._d4 * Math.sin(4 * xphi) +
            this._d6 * Math.sin(6 * xphi) +
            this._d8 * Math.sin(8 * xphi);

        return RAD_TO_DEG * latitude;
    }
}

export {MetricMercator};
