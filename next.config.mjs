/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Add the Google image hostname
        pathname: '/**', // Allow any path under this hostname
      },
    ],
  },
};

export default nextConfig;
