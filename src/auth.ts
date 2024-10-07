import { db } from '@/db';
import { memberTable } from '@/db/schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Check if the credentials are provided
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Fetch the user by email
                const user = await db
                    .select()
                    .from(memberTable)
                    .where(eq(memberTable.email, credentials.email as string))
                    .execute();

                // Check if user exists
                if (!user.length) {
                    throw new Error('No user found with the given email');
                }

                const foundUser = user[0];

                // Compare the provided password with the stored hash using bcrypt
                const isPasswordValid = await bcrypt.compare(
                    String(credentials.password),
                    foundUser.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                // Return user object if login is successful
                return {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: `${foundUser.firstName} ${foundUser.lastName}`,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Add user information to the JWT token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Add user info to the session
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            return true;
        },
    },
    adapter: DrizzleAdapter(db),
    pages: {
        signIn: '/signin',
    },
});
