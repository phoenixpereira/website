import { auth } from '@/auth';
import { checkUserExists } from '@/server/check-user-exists';
import { verifyMembershipPayment } from '@/server/verify-membership-payment';
import md5 from 'md5';
import HeaderClient from './HeaderClient';
import HeaderMobileClient from './HeaderMobileClient';

const getHeaderData = async (req: Request) => {
    // Function to get the Gravatar URL based on user's email
    const getGravatarUrl = (email: string) => {
        const gravatarHash = md5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon`;
    };

    const session = await auth();

    if (!session) {
        return { isSignedIn: false as const };
    }

    let nextStep: 'signup' | 'payment' | null = null;

    // Using the email from the token to check user existence
    const exists = await checkUserExists(session.user?.id as string);

    if (exists) {
        const membershipPayment = await verifyMembershipPayment(session.user?.id as string);
        console.log(membershipPayment);
        if (!membershipPayment.paid) {
            nextStep = 'payment';
        }
    } else {
        nextStep = 'signup';
    }

    // Generate avatar URL using the email from the token
    const avatar = session.user?.email ? getGravatarUrl(session.user?.email) : '';

    return {
        isSignedIn: true as const,
        avatar: avatar,
        // isAdmin: token.isAdmin ?? false,
        nextStep,
        isMember: nextStep === null,
    };
};

export type HeaderData = Awaited<ReturnType<typeof getHeaderData>>;

export default async function Header(req: Request) {
    const headerData = await getHeaderData(req);

    return (
        <>
            <HeaderClient data={headerData} className="hidden md:block" />
            <HeaderMobileClient data={headerData} className="md:hidden" />
        </>
    );
}
