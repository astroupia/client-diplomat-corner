import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "diplomatcorner.net",
      "images.clerk.dev",
      "img.clerk.com",
      "uploadthing.com",
      "media-api.media-api.diplomatcorner.net",
      "media-api.diplomatcorner.net",
      "utfs.io",
      "files.stripe.com",
      "www.gravatar.com",
      "avatars.githubusercontent.com",
    ],
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
