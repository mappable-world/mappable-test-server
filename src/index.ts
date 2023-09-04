import {createApp} from './app/app';
import {logger} from './app/lib/logger';
import {config, ENVIRONMENT} from './app/config';

createApp().then((app) =>
    app.listen(config.port, config.host, () => {
        logger.info(`App has started at http://${config.host}:${config.port} , mode: ${ENVIRONMENT}`);
    })
);
