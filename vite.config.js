import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 👈 必须引入这个 nodejs 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 告诉 Vite：@ 就是 src 目录
    }
  },
  server: {
    // --- 新增以下代理配置 ---
    host: '0.0.0.0', // 允许局域网访问
    proxy: {
      '/ollama': {
        target: 'http://localhost:11434', // 你的 Ollama 地址 http://localhost:11434 http://192.168.0.159:11434
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, '') // 去掉 /ollama 前缀
      }
    }
  }
})
// # 第一步：允许跨域（解决手机访问报错）
// $env:OLLAMA_ORIGINS="*"

// # 第二步：监听所有网卡（解决 IP 访问不到 localhost 的问题）
// $env:OLLAMA_HOST="0.0.0.0"

// # 第三步：直接启动服务
// ollama serve