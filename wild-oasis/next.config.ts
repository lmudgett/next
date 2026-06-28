import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Cabin images are sent base64-encoded through a Server Action, which
    // inflates size by ~33%. The default 1MB limit rejects normal photos, so
    // raise it so image uploads work as they did before the framework upgrade.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
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
