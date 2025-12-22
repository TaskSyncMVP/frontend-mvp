import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {},
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': `${__dirname}/src`,
            '@app': `${__dirname}/src/app`,
            '@pages': `${__dirname}/src/pages`,
            '@widgets': `${__dirname}/src/widgets`,
            '@features': `${__dirname}/src/features`,
            '@entities': `${__dirname}/src/entities`,
            '@shared': `${__dirname}/src/shared`,
        };
        return config;
    },
};

export default nextConfig;
