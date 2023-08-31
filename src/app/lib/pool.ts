import {Pool, QueryResult} from 'pg';
import {logger} from './logger';
import {config} from '../config';

export class DB {
    #pool: Pool;
    protected constructor() {
        this.#pool = new Pool(config.db);
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
    async query(sql: string, values?: unknown[]): Promise<QueryResult> {
        try {
            return await this.#pool.query(sql, values);
        } catch (e) {
            const result: Record<string, unknown> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const _e = e as any;

            for (const key of Object.getOwnPropertyNames(e)) {
                result[key] = _e[key];
            }

            logger.error(JSON.stringify(result));
            throw e;
        }
    }
}
