import {LngLat, Point} from '../geo';
import {MetricMercator} from './metric-mercator';
import {cycleRestrict, RAD_TO_DEG, restrict} from './restrict';

const mercator = new MetricMercator();
const halfEquator = Math.PI * mercator.radius;

export function fromWorldCoordinates(coordinates: Point): LngLat {
    let lat = mercator.yToLatitude(halfEquator - (1 - coordinates.y) * halfEquator);
    lat = restrict(lat, -90, 90);
    const lng = RAD_TO_DEG * cycleRestrict(Math.PI * coordinates.x, -Math.PI, Math.PI);
    return [lng, lat];
}
