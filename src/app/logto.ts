import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        LOGTO_ENDPOINT: z.string().min(1),
        LOGTO_APP_ID: z.string().min(1),
        LOGTO_APP_SECRET: z.string().min(1),
        LOGTO_BASE_URL: z.string().min(1),
        LOGTO_COOKIE_SECRET: z.string().min(1),
    },
    client: {},
    experimental__runtimeEnv: {
        LOGTO_ENDPOINT: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT,
        LOGTO_APP_ID: process.env.NEXT_PUBLIC_LOGTO_APP_ID,
        LOGTO_APP_SECRET: process.env.NEXT_PUBLIC_LOGTO_APP_SECRET,
        LOGTO_BASE_URL: process.env.NEXT_PUBLIC_LOGTO_BASE_URL,
        LOGTO_COOKIE_SECRET: process.env.NEXT_PUBLIC_LOGTO_COOKIE_SECRET,
    },
});

export const logtoConfig = {
    endpoint: env.LOGTO_ENDPOINT || '',
    appId: env.LOGTO_APP_ID || '',
    appSecret: env.LOGTO_APP_SECRET || '',
    baseUrl: env.LOGTO_BASE_URL || '',
    cookieSecret: env.LOGTO_COOKIE_SECRET || '',
    cookieSecure: process.env.NODE_ENV === 'production',
};
