import {Router} from 'express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';

const apiSpec = yaml.load(fs.readFileSync(path.join(__dirname, '../../../docs/v1/spec.yaml'), 'utf8')) as object;

export const apiDocs = Router()
    .use('/', swaggerUi.serve)
    .get('/', swaggerUi.setup(apiSpec));
