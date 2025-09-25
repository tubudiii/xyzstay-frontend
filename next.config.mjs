const storageBase =
  process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "http://localhost:3000";
let storageUrl;
try {
  storageUrl = new URL(storageBase);
} catch (e) {
  // Fallback to localhost to avoid config crashes when env is missing at build time
  storageUrl = new URL("http://localhost:3000");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: storageUrl.protocol.replace(":", ""),
        hostname: storageUrl.hostname,
        port: storageUrl.port,
        pathname: "/storage/**",
      },
      {
        protocol: storageUrl.protocol.replace(":", ""),
        hostname: storageUrl.hostname,
        port: storageUrl.port,
        pathname: "/cities/**",
      },
    ],
    domains: ["via.placeholder.com"],
  },
};

export default nextConfig;
