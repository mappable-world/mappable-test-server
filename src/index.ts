import {createApp} from "./app/app";
import {logger} from "./app/lib/logger";
import dotenv from 'dotenv';
import {DbDataProvider} from "./app/data-provider/db-data-provider/db-data-provider";

dotenv.config();
const dataProvider = new DbDataProvider();

const port = process.env.MAPS_NODEJS_PORT || 8080;
createApp(dataProvider).listen(port, () => {
    logger.info('', `App has started at http://localhost:${port}`);
});
