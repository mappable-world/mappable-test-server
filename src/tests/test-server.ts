import assert from 'assert';
import * as http from 'http';
import {URL} from 'url';
import * as express from 'express';
import got from 'got';
import {AddressInfo} from 'net';
/* eslint "@typescript-eslint/no-explicit-any": "off" */
export class TestServer {
    private readonly _server: http.Server;
    private readonly _baseUrl: string;
    private _isClosed: boolean = false;

    get url(): string {
        assert(!this._isClosed, 'Server is closed');
        return this._baseUrl;
    }

    private constructor(server: http.Server) {
        this._server = server;
        const port = (server.address() as AddressInfo).port;
        this._baseUrl = `http://127.0.0.1:${port}`;
    }

    static async start(app: express.Application): Promise<TestServer> {
        const server = http.createServer(app);
        await new Promise((resolve) => {
            server.listen(resolve);
        });
        return new this(server);
    }

    stop(): Promise<void> {
        this._isClosed = true;
        return new Promise((resolve, reject) => {
            this._server.close((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // Repeat `got.GotFn` interface.
    request(path: string): got.GotPromise<string>;
    request(path: string, options: got.GotJSONOptions): got.GotPromise<any>;
    request(path: string, options: got.GotFormOptions<string>): got.GotPromise<string>;
    request(path: string, options: got.GotFormOptions<null>): got.GotPromise<Buffer>;
    request(path: string, options: got.GotBodyOptions<string>): got.GotPromise<string>;
    request(path: string, options: got.GotBodyOptions<null>): got.GotPromise<Buffer>;
    request(path: string, options?: got.GotOptions<any>): got.GotPromise<any> {
        assert(!this._isClosed, 'Server is closed');
        const url = new URL(path, this._baseUrl);

        return got(url, {
            ...options,
            // Disable throwing errors for testing error codes.
            throwHttpErrors: false,
            encoding: '',
            retry: 0
        });
    }
}
