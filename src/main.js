import { createApp } from 'vue'
import './style.css' // 默认样式，可以保留
import App from './App.vue'
import router from './router' // 引入路由

const app = createApp(App)
app.use(router) // 挂载路由
app.mount('#app')