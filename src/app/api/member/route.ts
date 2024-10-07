import { auth } from '@/auth';
import { db } from '@/db';
import { memberTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    const req = await request.json();
    console.log(req);
    const session = await auth();

    if (!session) {
        return new Response(null, { status: 401 });
    }

    // Destructure the values from req.data
    const { studentStatus, studentId, ageBracket, gender, degree, studentType } = req;

    // Ensure that the required fields are present before proceeding
    if (!studentStatus && !studentId && !ageBracket && !gender && !degree && !studentType) {
        return new Response(JSON.stringify({ error: 'No data provided to update' }), {
            status: 400,
        });
    }

    await db
        .update(memberTable)
        .set({
            ...(studentStatus && { studentStatus }),
            ...(studentId && { studentId }),
            ...(ageBracket && { ageBracket }),
            ...(gender && { gender }),
            ...(degree && { degree }),
            ...(studentType && { studentType }),
        })
        .where(eq(memberTable.id, session.user?.id ?? ''));

    // Return success response
    return Response.json({ success: true });
}
