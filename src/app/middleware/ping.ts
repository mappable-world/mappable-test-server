import type {Request, Response} from 'express';
import {DataProvider} from '../data-provider/interface';

export const pingMiddleware = async (provider: DataProvider, _: Request, res: Response) => {
    try {
        await provider.checkConnection();
    } catch (error: unknown) {
        res.status(500).send({ok: false});
        return;
    }

    res.send({ok: true});
};
