/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "build",
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
