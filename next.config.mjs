const storageUrl = new URL(process.env.NEXT_PUBLIC_STORAGE_BASE_URL);

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
