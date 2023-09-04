import type {Request, Response} from 'express';

export const pingMiddleware = (req: Request, res: Response) => {
    res.send({ok: true});
};
