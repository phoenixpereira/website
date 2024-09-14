import { logtoConfig } from '@/app/logto';
import { getLogtoContext, signIn } from '@logto/next/server-actions';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Join from './Join';

export const metadata: Metadata = {
    title: 'Join',
};

export default async function JoinPage() {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);

    // if (isAuthenticated) {
    //     redirect('/');
    // }

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
