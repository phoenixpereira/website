'use client';

import Button from '@/components/Button';
import ControlledField from '@/components/ControlledField';
import FancyRectangle from '@/components/FancyRectangle';
import { login } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';
import { handleAuthErrors } from '../helpers';
import { emailSchema } from '../schemas';

const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, { message: 'Please enter your password' }),
});

export default function SignIn() {
    const form = useForm<z.infer<typeof signInSchema>>({
        defaultValues: { email: '', password: '' },
        resolver: zodResolver(signInSchema),
    });

    const [signInLoading, setSignInLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = form.handleSubmit(async (data) => {
        setSignInLoading(true);

        // Create a FormData instance and append the data
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);

        // Call the login function from lib/actions
        const { message, errors } = await login({}, formData);

        // Handle success or errors
        if (message === 'success') {
            // Redirect to home or desired page after successful login
            router.push('/');
            router.refresh();
        } else {
            // Handle validation errors from login function
            console.log('errors', errors);
            // handleAuthErrors(new Error(message), form, [
            //     { code: 'credentials', field: 'email', message: errors.credentials || '' },
            //     { code: 'unknown', field: 'unknown', message: errors.unknown || '' },
            // ]);
        }

        setSignInLoading(false);
    });

    const handleGoogleSignIn = async () => {
        // Placeholder for Google sign-in logic
    };

    return (
        <main className="flex flex-col items-center">
            <section className="w-full max-w-lg">
                <FancyRectangle colour="purple" offset="8" filled fullWidth>
                    <div className="z-0 w-full border-4 border-black bg-white px-12 py-12 text-black">
                        {/* Heading */}
                        <h3 className="text-3xl font-bold">Sign In</h3>
                        <p className="mb-8 text-xl">Sign into your account</p>

                        <Button
                            onClick={handleGoogleSignIn}
                            colour="white"
                            width="w-full"
                            size="small"
                        >
                            <FcGoogle className="mr-2 inline-block text-xl" /> Continue with Google
                        </Button>

                        <div className="my-6 mt-10 flex items-center justify-center">
                            <div className="w-full border-t border-grey" />
                            <p className="mx-4 text-grey">or</p>
                            <div className="w-full border-t border-grey" />
                        </div>
                        <form onSubmit={handleSignIn}>
                            <ControlledField label="Email" control={form.control} name="email" />
                            <ControlledField
                                label="Password"
                                control={form.control}
                                name="password"
                                type="password"
                            />
                            <Link
                                href="/forgot-password"
                                className="mb-8 flex text-lg text-orange md:text-base"
                            >
                                Forgot password?
                            </Link>
                            <Button
                                type="submit"
                                colour="orange"
                                width="w-full"
                                size="small"
                                loading={signInLoading}
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Sign-up option */}
                        <div className="mt-10 flex">
                            <p className="text-lg text-grey md:text-base">
                                Don&apos;t have an account yet?{' '}
                                <Link href="/join" className="text-orange">
                                    Join Us
                                </Link>
                            </p>
                        </div>
                    </div>
                </FancyRectangle>
            </section>
        </main>
    );
}
