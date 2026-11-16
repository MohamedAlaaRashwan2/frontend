import type { NextConfig } from "next";

const strapiUrl = new URL(process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Adds the common laptop widths, so a 1366px screen isn't sent a 1920px photograph.
    deviceSizes: [640, 750, 828, 1080, 1280, 1536, 1920, 2048],
    qualities: [62, 75],
    // Media uploaded through Strapi is served from the CMS host.
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
  // Pages from the previous sitemap, so existing links and search results keep working.
  async redirects() {
    return [
      { source: "/:lang(en|ar)/products/:slug", destination: "/:lang/products", permanent: true },
    ];
  },
};

export default nextConfig;
