import { db } from '@/db';
import { memberTable } from '@/db/schema';
import { stackServerApp } from '@/stack';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export async function POST(request: Request) {
    const req = await request.json();
    const schema = createInsertSchema(memberTable, {
        stackAuthId: z.undefined(),
        email: z.undefined(),
    });

    const user = await stackServerApp.getUser();
    if (!user) {
        return new Response(null, { status: 401 });
    }

    const reqBody = schema.safeParse(req);
    if (!reqBody.success) {
        return new Response(JSON.stringify(reqBody.error.format()), { status: 400 });
    }

    await db.insert(memberTable).values({
        stackAuthId: user.id,
        email: user.primaryEmail,
        ...reqBody.data,
    });
    return Response.json({ success: true });
}
