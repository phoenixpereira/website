import { checkUserExists } from '@/server/check-user-exists';
import { verifyMembershipPayment } from '@/server/verify-membership-payment';
import { stackServerApp } from '@/stack';
import md5 from 'md5';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header'), { ssr: true });

// Get the Gravatar URL based on user's email
const getGravatarUrl = (email: string) => {
    const gravatarHash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon`;
};

// Fetch user and header data
async function getHeaderData() {
    try {
        // Default data (fallback)
        const defaultData = {
            isSignedIn: false,
            nextStep: null,
            isMember: false,
            avatar: '',
            isAdmin: false,
        };

        const user = await stackServerApp.getUser();
        if (!user) {
            return defaultData;
        }

        let nextStep: 'signup' | 'payment' | null = null;
        const exists = await checkUserExists(user.id);
        if (exists) {
            const membershipPayment = await verifyMembershipPayment(user.id);
            if (!membershipPayment.paid) {
                nextStep = 'payment';
            }
        } else {
            nextStep = 'signup';
        }

        const avatar = getGravatarUrl(user.primaryEmail);

        return {
            isSignedIn: true,
            nextStep,
            isMember: nextStep === null,
            avatar,
            isAdmin: user.clientMetadata.isAdmin,
        };
    } catch (error) {
        console.error('Error fetching header data:', error);
        return {
            isSignedIn: false,
            nextStep: null,
            isMember: false,
            avatar: '',
            isAdmin: false,
        };
    }
}

// Render Header
export default async function RenderHeader() {
    const headerData = await getHeaderData();
    return <Header serverData={headerData} />;
}
