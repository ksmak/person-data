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
  images: {
    domains: ["qaraubucket.s3.eu-north-1.amazonaws.com"],
  },
};

export default nextConfig;
