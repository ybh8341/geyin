import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to resolve "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Makes process.env.API_KEY available in the browser code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
  };
});