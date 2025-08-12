const storageUrl = new URL(process.env.NEXT_PUBLIC_STORAGE_BASE_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: storageUrl.protocol.replace(":", ""), // "http"
        hostname: storageUrl.hostname, // "127.0.0.1"
        port: storageUrl.port, // "8000"
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
