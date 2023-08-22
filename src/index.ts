import {createApp} from './app/app';
import {logger} from './app/lib/logger';
import dotenv from 'dotenv';
import {DbDataProvider} from './app/data-provider/db-data-provider/db-data-provider';

dotenv.config();
const dataProvider = new DbDataProvider();

const port = process.env.PORT ? +process.env.PORT : 8080;
const host = process.env.HOST ? process.env.HOST : '0.0.0.0';
createApp(dataProvider).listen(port, host, () => {
    logger.info(`App has started at http://${host}:${port}`);
});
