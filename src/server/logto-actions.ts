'use server';

import { signIn, signOut } from '@logto/next/server-actions';
import { logtoConfig } from '../app/logto';

// Sign in action
export const handleSignIn = async () => {
    await signIn(logtoConfig);
};

// Sign out action
export const handleSignOut = async () => {
    await signOut(logtoConfig);
};
