import type Config from './types';
import development from './development';

const testing: Config = {
    ...development,
    defaultProvider: 'json'
};

export default testing;
