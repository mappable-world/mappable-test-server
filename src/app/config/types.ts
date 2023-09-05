import type {PoolConfig} from 'pg';

export default interface Config {
    port: number;
    host: string;
    defaultProvider: 'db' | 'json';
    db: PoolConfig;
    logger: {
        disableLogging: boolean;
    };
    pointsImportUrl: string;
    cors: {
        origin: string[] | boolean;
        methods: Array<'POST' | 'GET' | 'PUT'>;
    };
}
