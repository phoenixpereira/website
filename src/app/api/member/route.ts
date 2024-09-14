// import { currentUser } from '@clerk/nextjs';
import { logtoConfig } from '@/app/logto';
import { db } from '@/db';
import { memberTable } from '@/db/schema';
import { getLogtoContext } from '@logto/next/server-actions';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export async function POST(request: Request) {
    const req = await request.json();
    const schema = createInsertSchema(memberTable, {
        logtoID: z.undefined(),
        email: z.undefined(),
    });

    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated) {
        return new Response(null, { status: 401 });
    }

    const reqBody = schema.safeParse(req);
    if (!reqBody.success) {
        return new Response(JSON.stringify(reqBody.error.format()), { status: 400 });
    }

    await db.insert(memberTable).values({
        logtoID: claims?.sub ?? '',
        email: claims?.email ?? '',
        ...reqBody.data,
    });
    return Response.json({ success: true });
}
