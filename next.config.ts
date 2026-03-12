import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  /* config options here */
  images: {
    remotePatterns: [
      /*
      {
        protocol: 'https',
        hostname: NEXT_HOSTNAME
      },
      */
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc'
      }
    ]
  }

};

export default nextConfig;
