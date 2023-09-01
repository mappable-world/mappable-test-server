import * as nock from 'nock';
import {TestServer} from '../test-server';
import {createApp} from '../../app/app';
import type {Bounds} from '../../app/lib/geo';
import type {DataProvider} from '../../app/data-provider/interface';
import {JsonDataProvider} from '../../app/data-provider/json-data-provider/json-data-provider';
import fs from 'fs';
import path from 'path';
import {Feature, Point} from 'geojson';

describe('/v2', () => {
    let testServer: TestServer;
    let testDataProvider: DataProvider;

    beforeAll(async () => {
        nock.disableNetConnect();
        nock.enableNetConnect(/(127.0.0.1|localhost|cloudfront.net)/);
        testDataProvider = new JsonDataProvider();
        await testDataProvider.isReady();

        testServer = await TestServer.start(createApp());
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

                const result = res.body as {features: Feature[]; bounds: Bounds};
                expect(result.features.length).toEqual(21);
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
    });
});
