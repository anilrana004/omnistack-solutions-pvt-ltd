/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/services/ai-automation', destination: '/ai-automation-services', permanent: true },
      { source: '/services/cloud-devops', destination: '/cloud-devops-services', permanent: true },
      { source: '/services/startup-mvp', destination: '/startup-mvp-development', permanent: true },
      { source: '/services/web-development', destination: '/hire-react-developers', permanent: true },
      { source: '/services/backend-development', destination: '/hire-nodejs-developers', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/hero/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/logo/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // Faster production builds
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
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
    serverComponentsExternalPackages: ['mongoose'],
    optimizePackageImports: ['lucide-react', '@sanity/client'],
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


