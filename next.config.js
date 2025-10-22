/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'd3jvxfsgjxj1vz.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.gmdc.ae',
      },
      {
        protocol: 'https',
        hostname: 'blog.sothebysrealty.ae',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'd2hucwwplm5rxi.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.thenationalnews.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
    webpack: (config) => {
    // 🚫 Disable Webpack filesystem cache (prevents ENOENT issues on Bolt)
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;