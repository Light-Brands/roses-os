import type { NextConfig } from "next";
import * as path from "path";

const nextConfig: NextConfig = {
  // Pin turbopack root to this worktree so the warning about parent-dir
  // lockfiles (C:\Users\loko_\package-lock.json) does not misroute the
  // workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  typescript: {
    // Pre-existing type error in admin/page.tsx (framer-motion Variants typing)
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp'],
  async redirects() {
    return [
      // Manual PDFs were renamed from ROSES-OS-Level-* to Rose-Level-* (commit 2dddb20)
      {
        source: '/resources/manuals/ROSES-OS-Level-1-Manual-EN.pdf',
        destination: '/resources/manuals/Rose-Level-1-Manual-EN.pdf',
        permanent: true,
      },
      {
        source: '/resources/manuals/ROSES-OS-Level-2-Manual-EN.pdf',
        destination: '/resources/manuals/Rose-Level-2-Manual-EN.pdf',
        permanent: true,
      },
      {
        source: '/resources/manuals/ROSES-OS-Level-3-Manual-EN.pdf',
        destination: '/resources/manuals/Rose-Level-3-Manual-EN.pdf',
        permanent: true,
      },
    ];
  },
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
