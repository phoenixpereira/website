import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const isDev = process.env.NODE_ENV === 'development';

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(1),
        DATABASE_AUTH_TOKEN: isDev ? z.string().optional() : z.string().min(1),
        SQUARE_ACCESS_TOKEN: z.string().min(1),
        SQUARE_LOCATION_ID: z.string().min(1),
        REDIS_URI: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_DRIVE_LINK: z.string().url().min(1),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_DRIVE_LINK: process.env.NEXT_PUBLIC_DRIVE_LINK,
    },
    skipValidation: process.env.SKIP_ENV_VALIDATION,
});
