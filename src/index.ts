import {createApp} from './app/app';
import {logger} from './app/lib/logger';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ? +process.env.PORT : 8080;
const host = process.env.HOST ? process.env.HOST : '0.0.0.0';

createApp().listen(port, host, () => {
    logger.info(`App has started at http://${host}:${port}`);
});
