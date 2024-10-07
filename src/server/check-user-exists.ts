import { db } from '@/db';
import { memberTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const checkUserExists = cache(async (id: string) => {
    const existingUser = await db
        .select({ studentStatus: memberTable.studentStatus })
        .from(memberTable)
        .where(eq(memberTable.id, id));
    return existingUser.length > 0 && existingUser[0].studentStatus !== null;
});
