import { UserScope, LogtoNextConfig } from '@logto/next';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Create environment configuration
export const env = createEnv({
    server: {
        LOGTO_ENDPOINT: z.string().min(1),
        LOGTO_APP_ID: z.string().min(1),
        // LOGTO_APP_SECRET: z.string().min(1),
        // LOGTO_BASE_URL: z.string().min(1),
        // LOGTO_COOKIE_SECRET: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_LOGTO_ENDPOINT: z.string().min(1),
        NEXT_PUBLIC_LOGTO_APP_ID: z.string().min(1),
        NEXT_PUBLIC_LOGTO_BASE_URL: z.string().min(1),
        NEXT_PUBLIC_LOGTO_COOKIE_SECRET: z.string().min(1),
        NEXT_PUBLIC_LOGTO_APP_SECRET: z.string().min(1),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_LOGTO_ENDPOINT: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT,
        NEXT_PUBLIC_LOGTO_APP_ID: process.env.NEXT_PUBLIC_LOGTO_APP_ID,
        NEXT_PUBLIC_LOGTO_BASE_URL: process.env.NEXT_PUBLIC_LOGTO_BASE_URL,
        NEXT_PUBLIC_LOGTO_COOKIE_SECRET: process.env.NEXT_PUBLIC_LOGTO_COOKIE_SECRET,
        NEXT_PUBLIC_LOGTO_APP_SECRET: process.env.NEXT_PUBLIC_LOGTO_APP_SECRET,
    },
});

// Server-side configuration
export const logtoConfig: LogtoNextConfig = {
    scopes: [UserScope.Email, UserScope.CustomData],
    endpoint: env.NEXT_PUBLIC_LOGTO_ENDPOINT || '',
    appId: env.NEXT_PUBLIC_LOGTO_APP_ID || '',
    appSecret: env.NEXT_PUBLIC_LOGTO_APP_SECRET || '',
    baseUrl: env.NEXT_PUBLIC_LOGTO_BASE_URL || '',
    cookieSecret: env.NEXT_PUBLIC_LOGTO_COOKIE_SECRET || '',
    cookieSecure: process.env.NODE_ENV === 'production',
};
