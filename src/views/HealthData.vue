<template>
  <div class="health-page">
    <div class="header-row">
      <h2 class="title">健康趋势分析</h2>
      <button @click="exportToExcel" class="export-btn">
        <span class="icon">📊</span> 导出当天数据
      </button>
    </div>
    
    <div class="date-picker">
      <button class="active">近24小时</button>
    </div>

    <div class="chart-card">
      <div ref="chartDom" class="chart-container"></div>
    </div>

    <div class="data-summary-grid">
      <div class="summary-item">
        <label>平均心率</label>
        <div class="val">75 <span class="u">bpm</span></div>
      </div>
      <div class="summary-item">
        <label>当日峰值</label>
        <div class="val">110 <span class="u">bpm</span></div>
        <small class="time-label">14:30 运动时触发</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartDom = ref(null)

const dailyData = [
  { time: '00:00', heartRate: 60, status: '睡眠' },
  { time: '04:00', heartRate: 55, status: '睡眠' },
  { time: '08:00', heartRate: 75, status: '清醒' },
  { time: '12:00', heartRate: 80, status: '静坐' },
  { time: '16:00', heartRate: 95, status: '轻微活动' },
  { time: '20:00', heartRate: 70, status: '静坐' },
  { time: '24:00', heartRate: 65, status: '准备睡眠' }
]

const initChart = () => {
  const myChart = echarts.init(chartDom.value)
  
  const option = {
    backgroundColor: 'transparent',
    title: { 
      text: '心率变化趋势', 
      left: 'center',
      textStyle: { color: '#ffffff', fontSize: 18 } // 解决标题看不清
    },
    tooltip: { 
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderWidth: 0,
      textStyle: { color: '#fff' }
    },
    grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dailyData.map(item => item.time),
      axisLabel: { color: '#94a3b8' }, // 浅灰色文字，解决坐标轴看不清
      axisLine: { lineStyle: { color: '#334155' } }
    },
    yAxis: { 
      type: 'value', 
      min: 40, 
      max: 140,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } } // 网格线颜色
    },
    series: [{
      name: '心率',
      data: dailyData.map(item => item.heartRate),
      type: 'line',
      smooth: true,
      symbolSize: 8,
      areaStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(56, 189, 248, 0.5)' },
          { offset: 1, color: 'rgba(56, 189, 248, 0)' }
        ]) 
      },
      lineStyle: { color: '#38bdf8', width: 4 },
      itemStyle: { color: '#38bdf8', borderWidth: 2, borderColor: '#fff' }
    }]
  }
  myChart.setOption(option)
}

const exportToExcel = () => {
  let csvContent = "\ufeff时间,心率(BPM),状态\n";
  dailyData.forEach(item => { csvContent += `${item.time},${item.heartRate},${item.status}\n`; });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `健康数据_${new Date().toLocaleDateString()}.csv`;
  link.click();
}

onMounted(() => { initChart() })
</script>

<style scoped>
.health-page { 
  padding: 30px; 
  background: #0f172a; /* 统一电脑端的深色底色 */
  min-height: 100vh;
}

.title { color: #ffffff; font-weight: 600; }

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.export-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chart-card {
  background: #1e293b;
  border-radius: 16px;
  padding: 25px;
  border: 1px solid #334155;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.chart-container { width: 100%; height: 450px; }

.data-summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-top: 30px;
}

.summary-item {
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  border-left: 5px solid #38bdf8;
}

.summary-item label { color: #94a3b8; font-size: 15px; display: block; margin-bottom: 8px; }
.summary-item .val { font-size: 32px; font-weight: bold; color: #ffffff; }
.summary-item .u { font-size: 16px; color: #64748b; margin-left: 5px; }
.time-label { color: #64748b; font-size: 13px; margin-top: 5px; display: block; }

.date-picker button {
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 8px 18px;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.date-picker button.active {
  background: #38bdf8;
  color: #ffffff;
  border-color: #38bdf8;
}
</style>