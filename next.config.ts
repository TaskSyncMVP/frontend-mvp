import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {},

    // Оптимизация изображений
    images: {
        // Разрешить загрузку изображений из любых доменов (для CDN)
        domains: [],
        // Оптимизация форматов
        formats: ['image/avif', 'image/webp'],
        // Максимальные размеры
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Кэширование
        minimumCacheTTL: 60,
        // Локальные паттерны для SVG (чтобы не оптимизировать)
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

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

    // Оптимизация для production
    ...(process.env.NODE_ENV === 'production' && {
        // Включаем SWC minifier для лучших результатов
        swcMinify: true,
        // Оптимизация CSS
        optimizeCss: true,
    }),
};

export default nextConfig;
