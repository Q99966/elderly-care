<template>
  <div class="emergency-page police-flash">
    <div class="alert-content">
      <div class="sos-icon">🆘</div>
      <h1>紧急警报！正在联系救援</h1>
      <p>监控系统仍在后台运行中</p>
      
      <button @click="closeWindow" class="close-btn">处理完成 (关闭窗口)</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isInitialFlasher = ref(true); // 默认开启闪烁

// const goBack = () => {
//   router.push('/dashboard');
// };

onMounted(() => {
  // 2秒后停止红蓝交替闪烁，恢复为正常的紧急页面背景
  setTimeout(() => {
    isInitialFlasher.value = false;
  }, 2000);

  // 语音播报（可选，增加演示震撼感）
  const msg = new SpeechSynthesisUtterance("检测到紧急求助，请立即确认！");
  window.speechSynthesis.speak(msg);
});
const closeWindow = () => {
  window.close();
};
</script>

<style scoped>
/* 正常的紧急页面背景：深红色 */
.emergency-page {
  height: 100vh;
  background-color: #cf1322;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background-color 0.5s ease; /* 停止闪烁时平滑过渡 */
}

/* 🚨 红蓝交替闪烁核心动画 */
@keyframes police-light-flash {
  0% { background-color: #ff0000; } /* 纯红 */
  50% { background-color: #0000ff; } /* 纯蓝 */
  100% { background-color: #ff0000; }
}

.police-flash {
  /* 0.1s - 0.2s 频率是爆闪的感觉 */
  animation: police-light-flash 0.15s infinite; 
}

/* 其他样式保持之前的配置... */
.sos-anim { font-size: 80px; font-weight: bold; }
.back-btn { margin-top: 20px; padding: 10px 25px; border-radius: 20px; border: none; cursor: pointer; }
/* 保持红蓝爆闪动画... */
.close-btn {
  background: white;
  color: #b71c1c;
  padding: 12px 40px;
  border-radius: 30px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
</style>