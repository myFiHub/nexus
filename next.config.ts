import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure webpack to disable minification for Next.js 15
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Disable all minification
      config.optimization.minimize = false;

      // Disable SWC minification specifically
      if (config.optimization.minimizer) {
        config.optimization.minimizer = [];
      }

      // Keep source maps for debugging
      config.devtool = "source-map";
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.lumacdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.lu.ma",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/OneSignalSDKWorker.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
