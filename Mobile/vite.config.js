import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration for ReceiptlyPlus Mobile
 * 
 * This configuration is optimized for mobile development with Capacitor.
 * It includes settings for proper mobile asset handling and build optimization.
 * 
 * Key Features:
 * - React plugin for JSX support
 * - Mobile-optimized build settings
 * - Proper asset handling for Capacitor
 * - Source map generation for debugging
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */
export default defineConfig({
  plugins: [react()],
  base: './', // Important for Capacitor - relative paths
  resolve: {
    alias: {
      '@shared': '../../src',
      '@utils': '../../utils'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Enable source maps for mobile debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['jspdf', 'html2canvas'],
          signature: ['react-signature-canvas']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0', // Allow external connections for mobile testing
    port: 5173
  }
})

