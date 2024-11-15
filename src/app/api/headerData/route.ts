import { checkUserExists } from '@/server/check-user-exists';
import { verifyMembershipPayment } from '@/server/verify-membership-payment';
import { stackServerApp } from '@/stack';

// Get the user's sign-in status and the next step they need to take
export async function GET(req: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) {
            return new Response(JSON.stringify({ isSignedIn: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
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

        return new Response(
            JSON.stringify({
                isSignedIn: true,
                nextStep,
                isMember: nextStep === null,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
