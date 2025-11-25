import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],

  resolve: {
    alias: {
      "@": "/src",
      "@/components": "/src/components",
      "@/hooks": "/src/hooks",
      "@/utils": "/src/utils",
      "@/styles": "/src/styles",
      "@/assets": "/src/assets",
      "@/types": "/src/types",
      "@/config": "/src/config",
      "@/services": "/src/services",
      "@/context": "/src/context",
      "@/store": "/src/store",
      "@/api": "/src/api",
      "@/constants": "/src/constants",
      "@/pages": "/src/pages",
      "@/layouts": "/src/layouts",
      "@/routes": "/src/routes",
      "@/plugins": "/src/plugins",
      "@/redux": "/src/redux",
    },
  },
});
