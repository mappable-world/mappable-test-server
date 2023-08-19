import {ZodError} from 'zod';

export function formatZodError(error: ZodError): string {
    const errorMessage = error.issues.reduce((message, issue) => {
        return `${message} ${issue.path.join('/')} ${issue.message}`;
    }, '');

    return errorMessage;
}
