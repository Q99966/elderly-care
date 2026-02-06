<template>
  <div class="monitor-content">
    <div v-if="isAlerting" class="emergency-overlay">
      <div class="sos-glow">SOS EMERGENCY</div>
    </div>

    <div class="scroll-container">
      <section class="glass-module first-module">
        <div class="module-header">
          <span>智能监控终端</span>
          <span class="time-tag">{{ currentTime.split(' ')[1] }}</span>
        </div>
        <div class="conn-control">
          <div class="info-text">
            <span :class="['indicator', isConnected ? 'active' : '']"></span>
            {{ isConnected ? '实时监控链路已建立' : '等待设备接入中...' }}
          </div>
          <button @click="handleConnect" :class="['glow-btn', isConnected ? 'btn-red' : 'btn-blue']">
            {{ isConnected ? '断开连接' : '搜索设备' }}
          </button>
        </div>
      </section>

      <div class="stats-grid">
        <div class="glass-module stat-card">
          <div class="label">实时心率 (BPM)</div>
          <div class="value-row">
            <span :class="['heart-icon', isConnected ? 'beating' : '']">❤️</span>
            <span class="num">{{ isConnected ? currentHeartRate : '--' }}</span>
          </div>
        </div>
        <div class="glass-module stat-card">
          <div class="label">血氧饱和度 (%)</div>
          <div class="value-row">
            <span class="o2-icon">💧</span>
            <span class="num">{{ isConnected ? currentSpO2 : '--' }}</span>
          </div>
        </div>
      </div>

      <section class="glass-module chart-section">
        <div class="module-header">📉 24h 健康数据趋势分析</div>
        <div ref="chartDom" class="echarts-view"></div>
      </section>

      <section class="glass-module summary-section">
        <div class="summary-data">
          <div class="s-item">
            <label>平均心率</label> 
            <div class="val-group"><strong>75</strong> <small>bpm</small></div>
          </div>
          <div class="s-item">
            <label>当日峰值</label> 
            <div class="val-group"><strong>110</strong> <small>bpm</small></div>
          </div>
        </div>
        <button @click="exportToExcel" class="export-glow-btn">📥 导出当日健康报告 (CSV)</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { SerialManager } from '@/utils/serial';
import * as echarts from 'echarts';

const router = useRouter();
const isConnected = ref(false);
const isAlerting = ref(false);
const currentHeartRate = ref(75);
const currentSpO2 = ref(98);
const currentTime = ref(new Date().toLocaleString());
const chartDom = ref(null);
let myChart = null;

const serial = new SerialManager();
let simTimer = null;
let lineBuffer = "";

const dailyData = [
  { time: '00:00', heartRate: 60 }, { time: '04:00', heartRate: 55 },
  { time: '08:00', heartRate: 75 }, { time: '12:00', heartRate: 80 },
  { time: '16:00', heartRate: 95 }, { time: '20:00', heartRate: 70 },
  { time: '24:00', heartRate: 65 }
];

const initChart = () => {
  if (!chartDom.value) return;
  myChart = echarts.init(chartDom.value);
  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderWidth: 0, textStyle: { color: '#fff' } },
    grid: { left: '10%', right: '5%', bottom: '15%', top: '10%' },
    xAxis: {
      type: 'category',
      data: dailyData.map(item => item.time),
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } }
    },
    yAxis: {
      type: 'value',
      min: 40, max: 120,
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.1)' } }
    },
    series: [{
      data: dailyData.map(item => item.heartRate),
      type: 'line', smooth: true,
      lineStyle: { color: '#38bdf8', width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(56, 189, 248, 0.2)' },
          { offset: 1, color: 'rgba(56, 189, 248, 0)' }
        ])
      }
    }]
  };
  myChart.setOption(option);
};

const processDeviceData = (text) => {
  lineBuffer += text;
  if (lineBuffer.toUpperCase().includes('SOS')) {
    isAlerting.value = true;
    setTimeout(() => {
      isAlerting.value = false;
      // 弹出新窗口防止连接中断
      window.open('/emergency', 'EmergencyAlert', 'width=600,height=800');
    }, 2000);
    lineBuffer = "";
  }
};

const handleConnect = async () => {
  if (!isConnected.value) {
    if (await serial.connect(115200)) {
      isConnected.value = true;
      simTimer = setInterval(() => {
        currentHeartRate.value = Math.floor(Math.random() * (85 - 65)) + 65;
        currentSpO2.value = Math.floor(Math.random() * (99 - 97)) + 97;
        currentTime.value = new Date().toLocaleString();
      }, 2000);
      serial.startReading(processDeviceData);
    }
  } else {
    await serial.disconnect();
    isConnected.value = false;
    clearInterval(simTimer);
  }
};

const exportToExcel = () => {
  let csvContent = "\ufeff时间,心率(BPM)\n";
  dailyData.forEach(item => { csvContent += `${item.time},${item.heartRate}\n`; });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `健康报告_${new Date().toLocaleDateString()}.csv`;
  link.click();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => myChart?.resize());
});
onUnmounted(() => clearInterval(simTimer));
</script>

<style scoped>
/* 容器适配：移除背景，依赖 App.vue 的底色 */
.monitor-content {
  min-height: calc(100vh - 170px);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.scroll-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 玻璃卡片：增强与深色 Header 的契合度 */
.glass-module {
  background: rgba(30, 41, 59, 0.7); /* 深色磨砂 */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px;
  color: #f1f5f9;
}

/* 第一个模块的特殊间距，对齐 App.vue header 的底部圆角 */
.first-module {
  margin-top: 5px;
}

.module-header { 
  font-size: 14px; 
  color: #38bdf8; 
  font-weight: bold; 
  margin-bottom: 15px; 
  display: flex; 
  justify-content: space-between; 
}

.time-tag { color: #64748b; font-weight: normal; font-family: monospace; }

/* 指标卡片比例优化 */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-card { text-align: center; }
.stat-card .label { font-size: 11px; color: #94a3b8; margin-bottom: 10px; }
.stat-card .num { font-size: 36px; font-weight: 800; color: #fff; }

.echarts-view { height: 320px; width: 100%; }

/* 按钮与交互样式 */
.glow-btn { border: none; padding: 10px 20px; border-radius: 20px; color: white; cursor: pointer; font-weight: bold; transition: 0.3s; }
.btn-blue { background: #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
.btn-red { background: #ef4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }

.summary-data { display: flex; justify-content: space-around; margin-bottom: 15px; }
.s-item { text-align: center; }
.s-item label { font-size: 12px; color: #94a3b8; display: block; margin-bottom: 5px; }
.val-group strong { font-size: 22px; color: #fff; }

.export-glow-btn {
  width: 100%; padding: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white; border: none; border-radius: 12px;
  font-weight: bold; cursor: pointer;
}

.beating { display: inline-block; animation: beat 1.2s infinite; }
@keyframes beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }

.emergency-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(30,58,138,0.4) 100%);
  animation: alarmPulse 0.3s infinite alternate;
}
@keyframes alarmPulse { from { opacity: 0.6; } to { opacity: 1; } }
</style>