import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // temp till get auth working
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
