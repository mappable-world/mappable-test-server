import type {DataProvider} from './interface';
import {DbDataProvider} from './db-data-provider/db-data-provider';
import {JsonDataProvider} from './json-data-provider/json-data-provider';

const instances = new Map<'db' | 'json', DataProvider>();
export function getDataProvider(provider: 'db' | 'json'): DataProvider {
    if (instances.has(provider)) {
        return instances.get(provider) as DataProvider;
    }

    let instance: DataProvider;
    if (provider === 'db') {
        instance = new DbDataProvider();
    } else {
        instance = new JsonDataProvider();
    }

    instances.set(provider, instance);
    return instance;
}
