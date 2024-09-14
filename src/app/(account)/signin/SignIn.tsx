'use client';

import Button from '@/components/Button';
import FancyRectangle from '@/components/FancyRectangle';
import Link from 'next/link';

type Props = {
    onSignIn: () => Promise<void>;
};

export default function SignIn({ onSignIn }: Props) {
    return (
        <main className="flex flex-col items-center">
            <section className="w-full max-w-lg">
                <FancyRectangle colour="purple" offset="8" filled fullWidth>
                    <div className="z-0 w-full border-4 border-black bg-white px-12 py-12 text-black">
                        {/* Heading */}
                        <h3 className="text-3xl font-bold">Sign In</h3>
                        <p className="mb-8 text-xl">Sign into your account</p>

                        <Button
                            type="submit"
                            colour="orange"
                            width="w-full"
                            size="small"
                            onClick={() => {
                                onSignIn();
                            }}
                        >
                            Sign in with Logto
                        </Button>

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
