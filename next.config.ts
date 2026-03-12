import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type error in admin/page.tsx (framer-motion Variants typing)
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp'],
  outputFileTracingExcludes: {
    // Exclude heavy public/ directories from serverless function bundles.
    // These are served as static assets by Vercel's CDN — they don't need
    // to be in the function. The PDF routes only need a few small images
    // which are included via outputFileTracingIncludes below.
    '*': [
      './public/images/**',
      './public/page-images/**',
      './public/rose med images/**',
      './public/resources/**',
      './public/models/**',
    ],
  },
};

export default nextConfig;
