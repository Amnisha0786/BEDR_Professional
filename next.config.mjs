/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    });

    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
  experimental: {
    typedRoutes: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bedr-dev-s3.s3.eu-west-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
