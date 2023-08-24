import {createApp} from './app/app';
import {logger} from './app/lib/logger';
import dotenv from 'dotenv';
import {JsonDataProvider} from './app/data-provider/json-data-provider/json-data-provider';
import {DbDataProvider} from './app/data-provider/db-data-provider/db-data-provider';

dotenv.config();

const dataProvideType = process.env.DATA_PROVIDER ?? 'json';
const port = process.env.PORT ? +process.env.PORT : 8080;
const host = process.env.HOST ? process.env.HOST : '0.0.0.0';
createApp(dataProvideType === 'json' ? new JsonDataProvider() : new DbDataProvider()).listen(port, host, () => {
    logger.info(`App has started at http://${host}:${port}`);
});
