/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
    unoptimized: false,
  },
  // Webpack configuration for Windows path compatibility
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  // Disable strict file path checking for development
  experimental: {
    esmExternals: 'loose',
  },
  // Ignore ESLint during builds to prevent warnings from blocking deployment
  // ESLint will still run during local development via `npm run lint`
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during builds (if any occur)
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript errors visible, only ignore ESLint
  },
};

module.exports = nextConfig;


