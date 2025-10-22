/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fazaa.ae",
        pathname: "/upload/offers/dubai-driving-center-1689828346065.jpg",
      },
      {
        protocol: "https",
        hostname: "www.gmdc.ae",
        pathname: "/wp-content/uploads/2020/07/1.jpg",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname:
          "/p/AF1QipMEI_j3hzxXx8d6BdtT6mblAPHa73-L3vAu3yI1=s1360-w1360-h1020-rw",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/",
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
