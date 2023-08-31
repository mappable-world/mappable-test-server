export default interface Config {
    port: number;
    host: string;
    defaultProvider: 'db' | 'json';
    db: {
        user: string;
        host: string;
        database: string;
        password: string;
        port: number;
    },
    pointsImportUrl: string;
    cors: {
        origin: string[] | boolean;
        methods: Array<'POST' | 'GET' | 'PUT'>
    }
}
