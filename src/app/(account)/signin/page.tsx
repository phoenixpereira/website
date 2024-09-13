import { logtoConfig } from '@/app/logto';
import { getLogtoContext, signIn, signOut } from '@logto/next/server-actions';
import type { Metadata } from 'next';
import SignIn from './SignIn';
import SignOut from './SignOut';

export const metadata: Metadata = {
    title: 'Sign In',
};

const Home = async () => {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    return (
        <nav className="mt-64">
            {isAuthenticated ? (
                <p>
                    Hello, {claims?.sub},
                    <SignOut
                        onSignOut={async () => {
                            'use server';

                            await signOut(logtoConfig);
                        }}
                    />
                </p>
            ) : (
                <p>
                    <SignIn
                        onSignIn={async () => {
                            'use server';

                            await signIn(logtoConfig);
                        }}
                    />
                </p>
            )}
        </nav>
    );
};

export default Home;
