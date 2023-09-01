import type {Request, Response} from 'express';

export const pingMiddleware = async (req: Request, res: Response) => {
    try {
        await req.dataProvider.ready();
    } catch (error: unknown) {
        res.status(500).send({ok: false});
        return;
    }

    res.send({ok: true});
};
