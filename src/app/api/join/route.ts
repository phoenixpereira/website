import { db } from '@/db';
import { memberTable } from '@/db/schema';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Define the validation schema using Zod
const userSchema = z.object({
    firstName: z.string().nonempty('First name is required'),
    lastName: z.string().nonempty('Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
    try {
        // Parse the request body as JSON
        console.log('request', request);
        const reqBody = await request.json();

        // Validate the request body
        const validationResult = userSchema.safeParse(reqBody);
        if (!validationResult.success) {
            // If validation fails, return a 400 Bad Request with the validation errors
            return new Response(JSON.stringify(validationResult.error.format()), { status: 400 });
        }

        const { firstName, lastName, email, password } = validationResult.data;

        // Hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.insert(memberTable).values({
            firstName,
            lastName,
            email,
            passwordHash,
        });

        // Return a success response
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        // Catch and handle any unexpected errors
        console.error('Error in POST /api/join:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
