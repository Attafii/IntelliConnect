import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**', // Allows any image from the /api/portraits path
      },
    ],
  },
  /* other config options here */
};

export default nextConfig;
