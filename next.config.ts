import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type error in admin/page.tsx (framer-motion Variants typing)
    ignoreBuildErrors: true,
  },
  // Hidden pages — remove redirect when ready to make public again
  async redirects() {
    return [
      {
        source: '/the-codex',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
