/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.pexels.com',
      'd3jvxfsgjxj1vz.cloudfront.net',
      'www.gmdc.ae',
      'blog.sothebysrealty.ae',
      'encrypted-tbn0.gstatic.com',
      'd2hucwwplm5rxi.cloudfront.net',
      'www.thenationalnews.com',
      'i.ytimg.com',
      'ui-avatars.com',
    ],
  },
    webpack: (config) => {
    // 🚫 Disable Webpack filesystem cache (prevents ENOENT issues on Bolt)
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;