import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: (() => {
    const serverConfig: {
      host: string;
      port: number;
      https?: {
        key: Buffer;
        cert: Buffer;
      };
    } = {
      host: '0.0.0.0',
      port: 5173
    }
    
    try {
      serverConfig.https = {
        key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
      }
    } catch {
      // HTTPS certificates not found, using HTTP
    }
    
    return serverConfig
  })()
})
