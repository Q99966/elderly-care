<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-area">
        <div class="logo">🛡️</div>
        <h1>智慧养老监护</h1>
        <p>家人安心，时刻守护</p>
      </div>

      <div class="form-area">
        <div class="input-group">
          <span class="icon">📱</span>
          <input type="tel" placeholder="请输入手机号" v-model="phone">
        </div>
        <div class="input-group">
          <span class="icon">🔒</span>
          <input type="password" placeholder="请输入验证码/密码" v-model="code">
        </div>
        
        <button class="login-btn" @click="handleLogin">立即登录</button>
        <div class="links">
          <span>忘记密码?</span>
          <span>注册新账号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phone = ref('')
const code = ref('')

const handleLogin = () => {
  if(!phone.value) return alert('请输入手机号')
  // 模拟登录成功
  // 实际开发中这里调用后端 API
  router.push('/dashboard')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  /* 覆盖全局 padding */
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; 
}

.login-box {
  background: white; width: 100%; max-width: 400px;
  padding: 40px 30px; border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  text-align: center;
}

.logo { font-size: 60px; margin-bottom: 10px; }
h1 { color: #333; margin: 0; font-size: 24px; }
p { color: #999; margin: 10px 0 30px 0; font-size: 14px; }

.input-group {
  background: #f5f7fa; border-radius: 30px; padding: 12px 20px;
  margin-bottom: 20px; display: flex; align-items: center;
}
.input-group .icon { margin-right: 10px; opacity: 0.5; }
.input-group input { border: none; background: none; outline: none; flex: 1; font-size: 16px; }

.login-btn {
  width: 100%; background: #3a7bd5; color: white;
  border: none; padding: 15px; border-radius: 30px;
  font-size: 16px; font-weight: bold; cursor: pointer;
  box-shadow: 0 5px 15px rgba(58, 123, 213, 0.4);
  margin-bottom: 20px;
}
.login-btn:active { transform: scale(0.98); }

.links { display: flex; justify-content: space-between; color: #999; font-size: 14px; cursor: pointer; }
</style>