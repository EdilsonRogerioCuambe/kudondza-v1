import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t3.storage.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          "kudondza.2a5fec8467a9509a7ed294a3fdce7864.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      // https://pub-8c05bd36a6e2402b86f528ea4bca59fe.r2.dev
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
