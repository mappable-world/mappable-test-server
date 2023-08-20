import * as nock from 'nock';
import {TestServer} from '../test-server';
import {createApp} from '../../app/app';
import {Bounds, Feature} from '../../app/lib/geo';
import {DataProvider} from '../../app/data-provider/interface';
import {TestDataProvider} from '../test-data-provider';

describe('/v2', () => {
    let testServer: TestServer;
    let testDataProvider: DataProvider;

    beforeAll(async () => {
        nock.disableNetConnect();
        nock.enableNetConnect(/(127.0.0.1|localhost)/);
        testDataProvider = new TestDataProvider();
        await testDataProvider.isReady();

        testServer = await TestServer.start(createApp(testDataProvider));
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

    describe('Post v1', () => {
        describe('Check bbox', () => {
            it('should return several point inside bbox', async () => {
                const res = await testServer.request('/v1/bbox', {
                    method: 'post',
                    body: {
                        leftBottom: [-100, 100],
                        rightTop: [100, -100]
                    },
                    json: true
                });
                expect(res.statusCode).toEqual(200);

                const result = res.body as {features: Feature[]};
                expect(result.features.length).toEqual(100);
            });

            describe('Incorrect bbox request', () => {
                it('should return error', async () => {
                    const res = await testServer.request('/v1/bbox', {
                        method: 'post',
                        body: {
                            leftBottom: [-100, 100]
                        },
                        json: true
                    });
                    expect(res.statusCode).toEqual(400);
                });
            });
        });

        describe('Check tile', () => {
            it('should return several point inside tile', async () => {
                const res = await testServer.request('/v1/tile', {
                    method: 'post',
                    body: {
                        x: 10,
                        y: 11,
                        z: 5
                    },
                    json: true
                });
                expect(res.statusCode).toEqual(200);

                const result = res.body as {features: Feature[]; bounds: Bounds};
                expect(result.features.length).toEqual(21);
                expect(result.bounds).toEqual([
                    [-67.5, 49.11291284486365],
                    [-56.25, 41.17042723849767]
                ]);
            });

            describe('Incorrect tile request', () => {
                it('should return error', async () => {
                    const res = await testServer.request('/v1/bbox', {
                        method: 'post',
                        body: {
                            x: 10,
                            y: 11
                        },
                        json: true
                    });
                    expect(res.statusCode).toEqual(400);
                });
            });
        });
    });
});
