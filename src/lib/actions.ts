'use server';

import { signIn, signOut } from '@/auth';
import { loginSchema } from '@/types/schema';
import { AuthError } from 'next-auth';

const defaultValues = {
    email: '',
    password: '',
};

export async function login(prevState: any, formData: FormData) {
    try {
        // Ensure the formData contains expected fields
        const email = formData.get('email') as string | null;
        const password = formData.get('password') as string | null;

        // Check if email and password are retrieved
        if (!email || !password) {
            return {
                message: 'validation error',
                errors: {
                    ...defaultValues,
                    credentials: 'Email and password are required.',
                },
            };
        }

        const validatedFields = loginSchema.safeParse({
            email: email,
            password: password,
        });

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // Attempt to sign in using NextAuth
        const result = await signIn('credentials', { email, password, redirect: false });

        // Check if sign-in was successful
        if (result?.error) {
            return {
                message: 'credentials error',
                errors: {
                    ...defaultValues,
                    credentials: 'Incorrect email or password.',
                },
            };
        }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'credentials error',
                        errors: {
                            ...defaultValues,
                            credentials: 'Incorrect email or password.',
                        },
                    };
                default:
                    return {
                        message: 'unknown error',
                        errors: {
                            ...defaultValues,
                            unknown: 'An unknown error occurred.',
                        },
                    };
            }
        }

        // Handle unexpected errors
        console.error('Unexpected error in login:', error);
        return {
            message: 'unknown error',
            errors: {
                ...defaultValues,
                unknown: 'An unknown error occurred.',
            },
        };
    }
}

export async function logout() {
    await signOut();
}
