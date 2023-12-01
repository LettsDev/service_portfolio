import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../server/build/dist",
    manifest: true,
  },
  server: {
    // port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
