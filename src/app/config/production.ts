import Config from './types';
import {DEFAULT_JSON_URL} from './constants';
import dotenv from "dotenv";

dotenv.config();

const production: Config = {
    port: Number(process.env.PORT ?? 8080),
    host: process.env.HOST ?? '0.0.0.0',
    defaultProvider: (process.env.DATA_PROVIDER as 'db' | 'json') ?? 'json',
    db: {
        user: process.env.DB_USER ?? '',
        host: process.env.DB_HOST ?? '',
        database: process.env.DB_NAME ?? '',
        password: process.env.DB_PASSWORD ?? '',
        port: Number(process.env.DB_PORT ?? 5432)
    },
    pointsImportUrl: process.env.POINTS_JSON ?? DEFAULT_JSON_URL,
    cors: {
        origin: process.env.ORIGINS ? process.env.ORIGINS.split(' ') : true,
        methods: ['POST']
    }
};

export default production;
