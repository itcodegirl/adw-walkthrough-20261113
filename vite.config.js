import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Multi-page build: each HTML page is its own entry.
export default defineConfig({
  input: {
    main: resolve(import.meta.dirname, 'index.html'),
    about: resolve(import.meta.dirname, 'about.html'),
    admin: resolve(import.meta.dirname, 'admin.html'),
    login: resolve(import.meta.dirname, 'login.html'),
  },
})
