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
};

module.exports = nextConfig;


