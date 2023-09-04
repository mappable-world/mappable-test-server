import type {Request, Response} from 'express';
import {STATUSES} from '../config/constants';

export const pingMiddleware = (req: Request, res: Response) => {
    res.send({ok: req.dataProvider.status !== STATUSES.error});
};
