import { logtoConfig } from '@/app/logto';
import FancyRectangle from '@/components/FancyRectangle';
import Title from '@/components/Title';
import { checkUserExists } from '@/server/check-user-exists';
import { verifyMembershipPayment } from '@/server/verify-membership-payment';
import { getLogtoContext } from '@logto/next/server-actions';
// import { currentUser } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Settings from './Settings';

export const metadata: Metadata = {
    title: 'Settings',
    robots: { index: false, follow: false },
};

export default async function SettingsPage() {
    // const user = await currentUser();

    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated) return notFound();

    const exists = await checkUserExists(claims.sub);
    const membershipPayment = await verifyMembershipPayment(claims.sub);

    return (
        <main className="flex flex-col items-center gap-8 md:gap-16">
            <div className="flex justify-center">
                <Title colour="purple">Settings</Title>
            </div>
            <section className="w-full max-w-[62rem]">
                <FancyRectangle colour="purple" offset="8" filled fullWidth>
                    {exists ? (
                        <Settings settingData={{ membershipPayment }} />
                    ) : (
                        <h2 className="text-2xl">
                            Please finishing{' '}
                            <Link href="/join" className="font-bold text-purple">
                                signing up
                            </Link>{' '}
                            first.
                        </h2>
                    )}
                </FancyRectangle>
            </section>
        </main>
    );
}
