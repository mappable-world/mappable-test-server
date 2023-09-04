import * as fs from 'fs';
import * as path from 'path';
import express from 'express';

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8')) as {
    version: string;
};

export const versionMiddleware = async (_: express.Request, res: express.Response) => {
    res.send({version: packageJson.version});
};
