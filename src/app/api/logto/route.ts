import { logtoConfig } from '@/app/logto';
import { getLogtoContext } from '@logto/next/server-actions';

export async function GET(request: Request) {
    try {
        const { claims } = await getLogtoContext(logtoConfig);
        console.log(claims.sub);

        return new Response(claims.sub, { status: 200 });
    } catch (error) {
        return new Response('Failed to fetch logto context', { status: 500 });
    }
}
