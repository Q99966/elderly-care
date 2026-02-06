import { createRouter, createWebHistory } from 'vue-router'
import Emergency from '../views/Emergency.vue';
const routes = [
  // 把默认路径重定向到登录页
  { path: '/', redirect: '/login' }, 
  { 
    path: '/login', 
    component: () => import('../views/Login.vue'),
    // 关键标记：告诉 App.vue 隐藏布局
    meta: { hideLayout: true } 
  },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/health', component: () => import('../views/HealthData.vue') },
  { path: '/ai', component: () => import('../views/AiAssistant.vue') },
  { path: '/settings', component: () => import('../views/DeviceSettings.vue') },
  {
    path: '/emergency',
    name: 'Emergency',
    component: Emergency, // 确保这里指向了正确的组件变量
    meta: { hideLayout: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router