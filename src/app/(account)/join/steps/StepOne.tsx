import Button from '@/components/Button';
import ControlledField from '@/components/ControlledField';
import { fetcher } from '@/lib/fetcher';
// Import your custom fetcher
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';

// Define validation schema using Zod
const stepOneSchema = z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
});

export default function StepOne() {
    const router = useRouter();
    const form = useForm({
        defaultValues: { firstName: '', lastName: '', email: '', password: '' },
        resolver: zodResolver(stepOneSchema),
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle credentials signup
    const handleSignUp = form.handleSubmit(async (formData) => {
        setLoading(true);
        setErrorMessage(''); // Reset any previous error messages
        try {
            // Use the custom fetcher to send a POST request to create a new user
            await fetcher.post.mutate('join', {
                arg: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                },
            });

            // Sign in the user automatically after successful registration
            const signInResult = await signIn('credentials', {
                redirect: false, // Prevent automatic redirection
                email: formData.email,
                password: formData.password,
            });

            // Check if the sign-in was successful
            if (signInResult?.error) {
                throw new Error(signInResult.error);
            }

            // If successful, redirect to dashboard or another page
            router.push('/join');
        } catch (error) {
            console.error('Error during sign up:', error);
            setErrorMessage(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    });

    // Handle Google OAuth signup
    const handleGoogleSignUp = async () => {
        try {
            await signIn('google', { callbackUrl: '/dashboard' }); // Use NextAuth's signIn for Google OAuth
        } catch (error) {
            console.error('Google Sign-Up Error:', error);
        }
    };

    return (
        <div>
            {/* Google OAuth Sign Up Button */}
            <Button onClick={handleGoogleSignUp} colour="white" width="w-full" size="small">
                <FcGoogle className="mb-0.5 mr-2 inline-block text-xl" />
                Continue with Google
            </Button>

            <div className="my-6 mt-10 flex items-center justify-center">
                <div className="w-full border-t border-grey" />
                <p className="mx-4 text-grey">or</p>
                <div className="w-full border-t border-grey" />
            </div>

            {/* Credentials Sign Up Form */}
            <form onSubmit={handleSignUp}>
                <ControlledField label="First Name" control={form.control} name="firstName" />
                <ControlledField label="Last Name" control={form.control} name="lastName" />
                <ControlledField label="Email" control={form.control} name="email" />
                <ControlledField
                    label="Password"
                    control={form.control}
                    name="password"
                    type="password"
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}{' '}
                {/* Display error message */}
                <Button colour="orange" width="w-full" type="submit" loading={loading}>
                    Sign Up
                </Button>
            </form>

            {/* Sign-in option */}
            <div className="mt-10 flex">
                <p className="text-lg text-grey md:text-base">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-orange">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
