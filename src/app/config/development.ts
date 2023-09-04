import Config from './types';
import production from "./production";

const development: Config = {
    ...production
};

export default development;
