'use client';

import { useUser } from '@stackframe/stack';
import { redirect } from 'next/navigation';
import SignIn from './SignIn';

export default function SignInPage() {
    const user = useUser();

    if (user) {
        redirect('/settings');
    }

    return <SignIn />;
}
