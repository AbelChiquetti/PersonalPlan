/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "personalplan.vercel.app"],
    },
  },
  // Desabilitar a análise de fonte no client para evitar erros com fontes do Next
  optimizeFonts: false,
};

export default nextConfig;
