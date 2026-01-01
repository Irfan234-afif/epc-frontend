import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Development mode: enable untuk testing di localhost
      devOptions: {
        enabled: true, // Enable PWA in development mode for testing
        type: 'module',
      },
      // Production mode: PWA otomatis aktif setelah build
      // Tidak perlu konfigurasi khusus, akan otomatis generate service worker
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Employee Point Card',
        short_name: 'EPC',
        description: 'Employee Point Card Application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any', // Allow both portrait and landscape (cashier needs landscape)
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Exclude file besar dari precaching (akan di-load on-demand)
        globIgnores: ['**/cashier-portal.png'],
        // Increase limit untuk file besar (optional, jika ingin include file besar)
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/epc\.707\.co\.id\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache gambar besar on-demand (bukan precache)
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // Proxy configuration untuk membuat cookies bekerja di localhost
    // Pastikan di .env file, VITE_BACKEND_URL di development menggunakan path relatif
    // Contoh: VITE_BACKEND_URL="" atau VITE_BACKEND_URL="/"
    // Atau gunakan .env.local dengan VITE_BACKEND_URL kosong untuk override
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://epc.707.co.id',
        changeOrigin: true,
        secure: false,
        // Rewrite cookie domain agar cookies bisa digunakan di localhost
        cookieDomainRewrite: '',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/files': {
        target: process.env.VITE_BACKEND_URL || 'https://epc.707.co.id',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
      },
      '/private': {
        target: process.env.VITE_BACKEND_URL || 'https://epc.707.co.id',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
      },
    },
  },
})
