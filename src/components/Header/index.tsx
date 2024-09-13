import { logtoConfig } from '@/app/logto';
import { checkUserExists } from '@/server/check-user-exists';
import { verifyMembershipPayment } from '@/server/verify-membership-payment';
// import { currentUser } from '@clerk/nextjs';
import { getLogtoContext } from '@logto/next/server-actions';
import md5 from 'md5';
import HeaderClient from './HeaderClient';
import HeaderMobileClient from './HeaderMobileClient';

// Function to get the Gravatar URL based on user's email
const getGravatarUrl = (email: string) => {
    const gravatarHash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon`;
};

const getHeaderData = async () => {
    // const user = await currentUser();
    const { claims: { email } = {}, claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
        return { isSignedIn: false as const };
    }

    // let nextStep: 'signup' | 'payment' | null = null;
    // const exists = await checkUserExists(claims?.sub ?? '');
    // if (exists) {
    //     const membershipPayment = await verifyMembershipPayment(claims?.sub ?? '');
    //     if (!membershipPayment.paid) {
    //         nextStep = 'payment';
    //     }
    // } else {
    //     nextStep = 'signup';
    // }

    // Generate avatar URL
    const avatar = email ? getGravatarUrl(email) : '';

    return {
        isSignedIn: true as const,
        avatar: avatar,
        // isAdmin: (user.publicMetadata.isAdmin as boolean | undefined) ?? false,
        // nextStep,
        // isMember: nextStep === null,
    };
};
export type HeaderData = Awaited<ReturnType<typeof getHeaderData>>;

export default async function Header() {
    const headerData = await getHeaderData();

    return (
        <>
            <HeaderClient data={headerData} className="hidden md:block" />
            <HeaderMobileClient data={headerData} className="md:hidden" />
        </>
    );
}
