/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "build",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
