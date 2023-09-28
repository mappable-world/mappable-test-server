import * as nock from 'nock';
import {TestServer} from '../test-server';
import {createApp} from '../../app/app';
import type {Bounds} from '../../app/lib/geo';
import fs from 'fs';
import path from 'path';
import {Feature, Point} from 'geojson';

describe('/v1', () => {
    let testServer: TestServer;

    beforeAll(async () => {
        nock.disableNetConnect();
        nock.enableNetConnect(/(127.0.0.1|localhost|cloudfront.net)/);
        const app = await createApp();
        testServer = await TestServer.start(app);
    });

    afterAll(async () => {
        await testServer.stop();
        nock.enableNetConnect();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('Ping', () => {
        it('should check ping', async () => {
            const res = await testServer.request('ping', {json: true});
            expect(res.statusCode).toEqual(200);

            const result = res.body as {ok: boolean};
            expect(result.ok).toEqual(true);
        });
    });

    describe('Version', () => {
        it('should return version from package.json', async () => {
            const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8')) as {
                version: string;
            };

            const res = await testServer.request('version', {json: true});
            expect(res.statusCode).toEqual(200);

            const result = res.body as {version: string};
            expect(result.version).toEqual(packageJson.version);
        });
    });

    describe('Post v1', () => {
        describe('Check bbox', () => {
            it('should return several point inside bbox', async () => {
                const res = await testServer.request('/v1/bbox?lng1=-100&lat1=100&lng2=100&lat2=-100&limit=102', {
                    json: true
                });

                expect(res.statusCode).toEqual(200);

                const result = res.body as {features: Feature<Point>[]};
                expect(result.features.length).toEqual(102);

                expect(result.features[0].geometry.type).toEqual('Point');
                expect(result.features[0].geometry.coordinates).toEqual([53.796540969000034, 24.189215755000077]);
            });

            describe('Check pagination', () => {
                it('should return points by page', async () => {
                    const req = (page?: number) =>
                        testServer.request(`/v1/bbox?lng1=-100&lat1=100&lng2=100&lat2=-100&page=${page}&limit=102`, {
                            json: true
                        });
                    const res = await req(1);

                    expect(res.statusCode).toEqual(200);

                    const result = res.body as {features: Feature<Point>[]; bounds: Bounds};
                    expect(result.features.length).toEqual(102);
                    expect(result.features[0].geometry.coordinates).toEqual([53.796540969000034, 24.189215755000077]);
                    expect(result.features[0].id).toEqual('1');

                    const res2 = await req(2);
                    expect(res2.statusCode).toEqual(200);

                    const result2 = res2.body as {features: Feature<Point>[]; bounds: Bounds};
                    expect(result2.features.length).toEqual(102);
                    expect(result2.features[0].geometry.coordinates).not.toEqual(
                        result.features[0].geometry.coordinates
                    );
                });
            });

            describe('Incorrect bbox request', () => {
                it('should return error', async () => {
                    const res = await testServer.request('/v1/bbox?lng1=-100&lat1=100', {
                        json: true
                    });
                    expect(res.statusCode).toEqual(400);
                });
            });
        });

        describe('Check tile', () => {
            it('should return several point inside tile', async () => {
                const res = await testServer.request('/v1/tile?x=10&y=11&z=5', {
                    json: true
                });
                expect(res.statusCode).toEqual(200);

                const result = res.body as {features: Feature<Point>[]; bounds: Bounds};
                expect(result.features.length).toEqual(21);
                expect(result.features[0].geometry.type).toEqual('Point');
                expect(result.features[0].geometry.coordinates).toEqual([-62.54479907699994, 45.81303025200003]);
                expect(result.bounds).toEqual([
                    [-67.5, 48.92249926375823],
                    [-56.25, 40.97989806962013]
                ]);
            });

            describe('Incorrect tile request', () => {
                it('should return error', async () => {
                    const res = await testServer.request('/v1/bbox?x=10&y=11', {
                        json: true
                    });
                    expect(res.statusCode).toEqual(400);
                });
            });
        });

        describe('Check tile clusterer', () => {
            it('should return 1 point inside tile', async () => {
                const res = await testServer.request('/v1/tile-clusterer?x=10&y=11&z=5', {
                    json: true
                });
                expect(res.statusCode).toEqual(200);

                const result = res.body as {features: Feature<Point>[]; bounds: Bounds; minMax: Bounds};
                expect(result.features.length).toEqual(1);
                expect(result.bounds).toEqual([
                    [-67.5, 48.92249926375823],
                    [-56.25, 40.97989806962013]
                ]);

                expect(result.features[0].properties?.minMax).toEqual([
                    [-67.30010370199994, 47.960976981000044],
                    [-56.3153175459999, 43.45754888200008]
                ]);

                expect(result.features[0].properties?.count).toEqual(21);
                expect(result.features[0].geometry.coordinates).toEqual([-63.47844044033325, 45.776241485714344]);
                expect(result.features[0].id).toEqual('cluster-10-11-5');
            });
        });
    });
});
