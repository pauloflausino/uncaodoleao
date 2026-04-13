/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/uncaodoleao',
  assetPrefix: '/uncaodoleao',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
