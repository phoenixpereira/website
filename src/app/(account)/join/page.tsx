import { logtoConfig } from '@/app/logto';
import FancyRectangle from '@/components/FancyRectangle';
import Title from '@/components/Title';
import { checkUserExists } from '@/server/check-user-exists';
import { getLogtoContext, signIn } from '@logto/next/server-actions';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Join from './Join';
import JoinForm from './JoinForm';

export const metadata: Metadata = {
    title: 'Join',
};

export default async function JoinPage() {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated) {
        return (
            <nav className="mt-24">
                <Join
                    onJoin={async () => {
                        'use server';
                        await signIn(logtoConfig, 'http://localhost:3000/callback', 'signUp');
                    }}
                />
            </nav>
        );
    }

    const userExists = await checkUserExists(claims?.sub ?? '');
    if (userExists) {
        redirect('/settings');
    }

    return (
        <main className="flex flex-col items-center gap-8 md:gap-16">
            <Title colour="purple">Join Us</Title>
            <section>
                <div className="relative z-10 flex flex-col text-2xl font-black md:flex-row lg:text-3xl">
                    <h3>New Members are</h3>
                    <div className="mt-2 w-fit bg-purple px-2 md:ml-2 md:mt-0">
                        <h3 className=" text-grey">Always Welcome</h3>
                    </div>
                </div>
                <div className="mt-8 border-2 border-white px-4 py-4">
                    <p>
                        <span className="text-yellow">Membership costs $10</span> for the full year.
                        You can pay for membership online here at our website. Alternatively, you
                        can pay at a club event or contact one of the{' '}
                        <Link href="/about" className="underline">
                            committee members
                        </Link>
                        .
                    </p>
                    <p className="mt-4">
                        Create an <span className="text-orange">account below</span> to start the
                        registration process.
                    </p>
                </div>
            </section>

            <FancyRectangle colour="purple" offset="8" filled fullWidth>
                <JoinForm />
            </FancyRectangle>
        </main>
    );
}
