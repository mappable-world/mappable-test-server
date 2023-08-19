/** Convert from degrees to radians by multiplying by this constant */
export const DEG_TO_RAD = Math.PI / 180;

/** Convert from radians to degrees by multiplying by this constant */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Assigns a numeric value to the set range. The range of values is considered to be closed in a ring.
 */
export function cycleRestrict(value: number, min: number, max: number): number {
    return value - Math.floor((value - min) / (max - min)) * (max - min);
}

/**
 * Restricts an input numeric value to the set minimum and maximum limits.
 */
export function restrict(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}
