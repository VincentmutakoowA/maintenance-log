import type { NextConfig } from "next";
import { NEXT_HOSTNAME } from "./lib/config";

const nextConfig: NextConfig = {

  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: NEXT_HOSTNAME
      }
    ]
  }

};

export default nextConfig;
