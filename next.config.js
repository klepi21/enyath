/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  transpilePackages: ['@multiversx/sdk-dapp'],
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com','versus-projects.com']
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding', {
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate'
    });

    return config;
  }
};

module.exports = nextConfig;
