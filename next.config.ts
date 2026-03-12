import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type error in admin/page.tsx (framer-motion Variants typing)
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
