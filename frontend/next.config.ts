import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/stats',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
