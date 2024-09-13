import { logtoConfig } from '@/app/logto';
import { getLogtoContext, signIn } from '@logto/next/server-actions';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SignIn from './SignIn';

export const metadata: Metadata = {
    title: 'Sign In',
};

const Home = async () => {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);

    if (isAuthenticated) {
        redirect('/');
        return null;
    }

    return (
        <nav className="mt-24">
            <SignIn
                onSignIn={async () => {
                    'use server';
                    await signIn(logtoConfig);
                }}
            />
        </nav>
    );
};

export default Home;
