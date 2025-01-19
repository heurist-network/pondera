/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      url: false,
      util: false,
      stream: false,
      crypto: false,
    }
    return config
  },
}

export default nextConfig
