import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// راح نستخدم هذا المسار لو نشرنا على GitHub Pages تحت اسم مستودع فرعي
// عدّل base إلى '/اسم-المستودع/' عند النشر على GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true
      }
    }
  }
})
