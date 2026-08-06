import type { NextConfig } from "next";

const basePath = "/testosterona";

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1290, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [75, 90, 95],
  },
  async redirects() {
    return [
      {
        // Fora do basePath: captura a raiz do domínio, não /testosterona
        source: "/",
        destination: "https://www.grapeclinic.com.br/",
        permanent: false,
        basePath: false,
      },
    ];
  },
  async headers() {
    const immutable = "public, max-age=31536000, immutable";

    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: immutable }],
      },
    ];
  },
};

export default nextConfig;
