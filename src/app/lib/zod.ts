import {z, ZodError, ZodTypeAny} from 'zod';

export function formatZodError(error: ZodError): string {
    return error.issues.reduce((message, issue) => {
        return `${message} ${issue.path.join('/')} ${issue.message}`;
    }, '');
}

export const numericString = (schema: ZodTypeAny) =>
    z.preprocess((a) => {
        if (typeof a === 'string') {
            return parseFloat(a);
        }

        if (typeof a === 'number') {
            return a;
        }

        return undefined;
    }, schema);
