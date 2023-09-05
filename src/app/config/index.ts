import assert from 'assert';
import production from './production';
import testing from './testing';
import development from './development';
import type Config from './types';
import {ENVIRONMENT} from './constants';

const configs = new Map<typeof ENVIRONMENT | undefined, Readonly<Config>>([
    ['production', production],
    ['testing', testing],
    ['development', development]
]);

const configForEnv = configs.get(ENVIRONMENT);
assert(configForEnv, `There is no configuration for environment "${ENVIRONMENT}"`);
const config = configForEnv!;

export {config, Config, ENVIRONMENT};
