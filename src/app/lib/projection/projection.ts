import {LngLat, Point} from '../geo';

/** Convert from radians to degrees by multiplying by this constant */
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Assigns a numeric value to the set range. The range of values is considered to be closed in a ring.
 */
function cycleRestrict(value: number, min: number, max: number): number {
    return value - Math.floor((value - min) / (max - min)) * (max - min);
}

/**
 * Restricts an input numeric value to the set minimum and maximum limits.
 */
function restrict(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

/**
 * Convert world coordinates to Web Mercator projection.
 */
export function fromWorldCoordinates({x, y}: Point): LngLat {
    const longitude = cycleRestrict(x * Math.PI * RAD_TO_DEG, -180, 180);
    const mercatorDivR = -y * Math.PI;
    const latitude = Math.PI / 2 - 2 * Math.atan(Math.exp(mercatorDivR));

    return [longitude, restrict(latitude * RAD_TO_DEG, -90, 90)];
}

/**
 * Convert tile coordinates to special world coordinates.
 * It's not a real some standard, but it's used in mappable.
 */
export function tileToWorld(tx: number, ty: number, tz: number): [Point, Point] {
    const ntiles = 2 ** tz;
    const ts = (1 / ntiles) * 2;

    const x = (tx / ntiles) * 2 - 1;
    const y = -((ty / ntiles) * 2 - 1);

    return [
        {x, y},
        {x: x + ts, y: y - ts}
    ];
}
