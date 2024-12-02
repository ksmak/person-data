import { NextConfig } from "next";
import { Configuration } from "webpack";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1Gb",
    },
  },
  webpack(config: Configuration) {
    config.watchOptions = {
      ...(config.watchOptions || {}),
      poll: 1000, // Опрос каждые 1000мс
      aggregateTimeout: 300, // Задержка перед перестройкой
    };
    return config;
  },
  output: "standalone",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
