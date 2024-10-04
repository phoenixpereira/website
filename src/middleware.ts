import { authConfig } from '@/auth.config';
import { DEFAULT_REDIRECT, PRIVATE_ROUTES, ROOT } from '@/lib/routes';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isPrivateRoute = PRIVATE_ROUTES.includes(nextUrl.pathname); // Check for private routes

    // Redirect authenticated users away from public routes
    if (isPrivateRoute && isAuthenticated) {
        return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }

    // Redirect unauthenticated users trying to access private routes
    if (!isAuthenticated && isPrivateRoute) {
        return Response.redirect(new URL(ROOT, nextUrl));
    }

    // Allow access to public routes for unauthenticated users
    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
