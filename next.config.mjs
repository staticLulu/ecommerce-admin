/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Existing Google images configuration
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Firebase Storage configuration
        pathname: '/**', // Allow any path under this hostname
      },
    ],
  },
};

export default nextConfig;
