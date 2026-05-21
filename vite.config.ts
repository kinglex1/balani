import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})

export default config