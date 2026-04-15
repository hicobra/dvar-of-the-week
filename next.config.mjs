/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force cache invalidation for Batch 3 content rebuild
  onDemandISR: {
    revalidateTokenSecret: process.env.ON_DEMAND_REVALIDATE_SECRET,
  },
};

export default nextConfig;
