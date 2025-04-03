/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "personalplan.vercel.app"],
    },
  },
};

export default nextConfig;
