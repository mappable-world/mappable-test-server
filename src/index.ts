import {app} from "./app/app";
import {logger} from "./app/lib/logger";
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.MAPS_NODEJS_PORT || 8080;
app.listen(port, () => {
    logger.info('', `App has started at http://localhost:${port}`);
});
