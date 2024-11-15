import { checkUserExists } from '@/server/check-user-exists';
import { stackServerApp } from '@/stack';
import { redirect } from 'next/navigation';
import Join from './Join';

export default async function JoinPage() {
    const user = await stackServerApp.getUser();
    if (user) {
        const userExists = await checkUserExists(user.id);
        if (userExists) {
            redirect('/settings');
        }
    }
    return <Join />;
}
