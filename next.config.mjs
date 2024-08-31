import './src/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
        ],
    },
    typescript: {
        // Ignore TypeScript errors during production build
        ignoreBuildErrors: true,
    },
    eslint: {
        // Ignore ESLint errors during production build
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
