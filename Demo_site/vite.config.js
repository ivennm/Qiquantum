// Vite configuration.
//
// `host: true` binds the dev server to 0.0.0.0 instead of localhost so that the
// port can be mapped out of a container (see docker-compose.yml). It has no
// effect when running directly on a workstation other than making the dev
// server reachable from other machines on the LAN.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
});
