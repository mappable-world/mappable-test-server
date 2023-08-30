import {fromWorldCoordinates, tileToWorld} from './projection';

describe('Projection', () => {
    describe('Convert tiles coordinates to wgs84 bounds', () => {
        it('Should return wgs84 bounds by x, y, z', () => {
            const bounds = tileToWorld(10, 10, 10);
            expect(bounds).toEqual([
                {x: -0.98046875, y: 0.98046875},
                {x: -0.978515625, y: 0.978515625}
            ]);

            const bounds2 = tileToWorld(2, 3, 12);
            expect(bounds2).toEqual([
                {x: -0.9990234375, y: 0.99853515625},
                {x: -0.99853515625, y: 0.998046875}
            ]);
        });
    });

    describe('Convert tiles coordinates to LngLat bounds', () => {
        it('Should return LngLat bounds by x, y, z', () => {
            const bounds = tileToWorld(10, 10, 10);

            expect(bounds.map(fromWorldCoordinates)).toEqual([
                [-176.484375, 84.73838712095339],
                [-176.1328125, 84.7060489350415]
            ]);

            const bounds2 = tileToWorld(12, 11, 5);
            expect(bounds2.map(fromWorldCoordinates)).toEqual([
                [-45, 48.92249926375823],
                [-33.75, 40.97989806962013]
            ]);
        });
    });
});
