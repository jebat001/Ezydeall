/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
