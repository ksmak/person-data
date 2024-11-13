// next.config.ts
import { NextConfig } from 'next';
import { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpackDevMiddleware(config: Configuration) {
    // Ensure TypeScript knows that config is the correct type
    config.watchOptions = {
      poll: 1000,            // Poll every 1000ms (1 second)
      aggregateTimeout: 300, // Delay after the last change before rebuilding
    };
    return config;
  },
};

export default nextConfig;

