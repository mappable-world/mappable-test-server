import type {Request, Response} from 'express';
import {DB} from "../db/pool";
import {logger} from "../lib/logger";
import {stringifyError} from "../lib/error-handler";

export const pingMiddleware = async (req: Request, res: Response) => {
    try {
        await DB.getInstance().query('select now()');
    } catch(error: unknown) {
        logger.error(stringifyError(error as Error));
        res.status(500).send({ok: false});
        return;
    }

    res.send({ok: true});
};
