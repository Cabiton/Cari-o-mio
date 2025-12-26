/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Configuración para Canvas/Konva en server-side
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    }
    return config;
  },
  // Deshabilitar SSR para rutas específicas
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/canvas/**/*',
      ],
    },
  },
}

module.exports = nextConfig
