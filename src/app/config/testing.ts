import type Config from "./types";
import production from "./production";

const testing: Config = {
    ...production
}

export default testing;
