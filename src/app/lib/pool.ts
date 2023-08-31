import {Pool, QueryResult} from 'pg';
import {logger} from './logger';
import {stringifyError} from './error-handler';
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
            logger.error(stringifyError(e as Error));
            throw e;
        }
    }
}
