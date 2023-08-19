import {Pool, QueryResult} from 'pg';

export class DB {
    #pool: Pool;
    protected constructor() {
        this.#pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        });
    }

    static #instance: DB;

    static getInstance(): DB {
        if (!this.#instance) {
            this.#instance = new DB();
        }
        return this.#instance;
    }

    query(sql: string, values: unknown[]): Promise<QueryResult>;
    query(sql: string): Promise<QueryResult>;
    query(sql: string, values?: unknown[]): Promise<QueryResult> {
        return this.#pool.query(sql, values);
    }
}
