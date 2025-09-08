/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath makes the app generate links/assets under /client-dashboard
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  experimental: { serverActions: { allowedOrigins: ["*"] } },
};
export default nextConfig;
