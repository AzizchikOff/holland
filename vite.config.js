import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ✅ Rasmlarni build paytida optimallashtiradi + WebP chiqaradi
    ViteImageOptimizer({
      jpg:  { quality: 78 },
      jpeg: { quality: 78 },
      png:  { quality: 78 },
      webp: { quality: 78 },
      // WebP versiyasini ham yaratadi (brauzer qo'llab-quvvatlasa ishlatadi)
      includePublic: true,
    }),
  ],

  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console:  true,   // console.log larni o'chiradi
        drop_debugger: true,
        dead_code:     true,
        passes:        3,
      },
      mangle: { toplevel: true },
      format: { comments: false },
    },

    rollupOptions: {
      output: {
        // Vendor chunk ajratish — foydalanuvchi faqat o'zgargan chunk yuklab oladi
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/react-router-dom") || id.includes("node_modules/react-router/")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
        },
        chunkFileNames:  "assets/[name]-[hash].js",
        entryFileNames:  "assets/[name]-[hash].js",
        assetFileNames:  "assets/[name]-[hash].[ext]",
      },
    },

    chunkSizeWarningLimit: 500,
    sourcemap:   false,
    cssMinify:   true,
    // 4KB dan kichik fayllar inline bo'ladi (kichik ikonkalar uchun foydali)
    assetsInlineLimit: 4096,
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});