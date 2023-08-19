import * as nock from 'nock';
import {TestServer} from '../test-server';
import {app} from '../../app/app';

describe('/v2', () => {
    let testServer: TestServer;

    beforeAll(async () => {
        nock.disableNetConnect();
        nock.enableNetConnect(/(127.0.0.1|localhost)/);

        testServer = await TestServer.start(app);
    });

    afterAll(async () => {
        await testServer.stop();
        nock.enableNetConnect();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('GET', () => {
        it('should check ping', async () => {
            const res = await testServer.request('ping', {json: true});
            expect(res.statusCode).toEqual(200);

            const result = res.body as {ok: boolean};
            expect(result.ok).toEqual(true);
        });
    });
});
