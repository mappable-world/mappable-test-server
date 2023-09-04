import type {Request, Response} from 'express';
import {statuses} from '../config/constants';

export const pingMiddleware = (req: Request, res: Response) => {
    res.send({ok: req.dataProvider.status !== statuses.error});
};
