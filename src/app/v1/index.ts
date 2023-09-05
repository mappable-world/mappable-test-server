import {Router} from 'express';
import {asyncMiddleware} from '../lib/async-middlware';
import {loadByTile} from './load-by-tile';
import {loadByBBox} from './load-by-bbox';
import {apiDocs} from '../middleware/api-docs';

export const router = Router({mergeParams: true})
    .use('/api_docs', apiDocs)
    .get('/tile', asyncMiddleware(loadByTile))
    .get('/bbox', asyncMiddleware(loadByBBox));
