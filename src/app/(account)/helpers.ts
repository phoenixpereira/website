import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Show Auth.js error message in form.
 *
 * @param error The error caught from the sign-in process
 * @param form The `react-hook-form` instance
 * @param authErrors Possible Auth.js errors
 */
export const handleAuthErrors = <TFieldValues extends FieldValues>(
    error: any,
    form: UseFormReturn<TFieldValues>,
    authErrors: Array<{ code: string; field: FieldPath<TFieldValues>; message: string }>
) => {
    // Extract error code from the Auth.js error structure
    const errorCode: string | undefined = error?.error?.code;

    if (!errorCode) {
        console.error(error);
        return;
    }

    // Find corresponding auth error
    const authError = authErrors.find(({ code }) => code === errorCode);

    // If there is no mapped error, log the error
    if (!authError) {
        console.error(error);
        return;
    }

    // Set the error message in the form
    form.setError(authError.field, { message: authError.message });
};
