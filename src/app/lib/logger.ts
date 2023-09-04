import {createLogger, transports} from 'winston';
import {config} from '../config';

export const logger = createLogger({
    transports: [new transports.Console({silent: config.logger.disableLogging})]
});
