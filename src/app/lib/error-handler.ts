export function stringifyError(error: Error): string {
    const result: Record<string, unknown> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _this = error as any;

    for (const key of Object.getOwnPropertyNames(error)) {
        result[key] = _this[key];
    }

    return JSON.stringify(result);
}
