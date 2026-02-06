<template>
  <div class="chat-page">
    
    <div class="chat-list" ref="chatListDom">
      <div v-for="(msg, index) in messages" :key="index" 
           class="message-item" 
           :class="{ 'my-msg': msg.role === 'user', 'ai-msg': msg.role === 'ai' }">
        
        <div class="avatar" v-if="msg.role === 'ai'">🤖</div>
        
        <div class="bubble">
          <div class="text">{{ msg.content }}</div>
          <div class="time">{{ msg.time }}</div>
        </div>

        <div class="avatar user" v-if="msg.role === 'user'">👨‍💼</div>
      </div>

      <div v-if="isTyping" class="message-item ai-msg">
        <div class="avatar">🤖</div>
        <div class="bubble typing">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input type="text" 
             v-model="inputText" 
             @keyup.enter="sendMessage"
             placeholder="输入您的问题，例如：老人今天心率正常吗？" />
      <button :disabled="!inputText.trim()" @click="sendMessage">发送</button>
    </div>

  </div>
</template>

<script setup>

import { ref, nextTick, onMounted } from 'vue'
import { chatWithAI } from '@/api/ai'
// !!! 关键配置：请确保这里是你本地 Ollama 已经 pull 过的模型名称 !!!
// 常用名: 'deepseek-r1', 'llama3', 'qwen2.5', 'gemma'
const MODEL_NAME = 'miniDocker_deepseekr1_1_5b:latest' 

const inputText = ref('')
const isTyping = ref(false)
const chatListDom = ref(null)

// 聊天历史 (用于发给 AI 上下文)
const messages = ref([
  { role: 'assistant', content: '您好，我是您的智能养老助手。您可以问我健康建议，或者让我陪您聊天。', time: getCurrentTime() }
])

function getCurrentTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatListDom.value) {
      chatListDom.value.scrollTop = chatListDom.value.scrollHeight
    }
  })
}
const sendMessage = async () => {
  // 1. 基础校验 (UI 逻辑)
  if (!inputText.value.trim()) return
  if (isTyping.value) return 

  // 2. 上屏用户消息 (UI 逻辑)
  const userContent = inputText.value
  messages.value.push({ role: 'user', content: userContent, time: getCurrentTime() })
  inputText.value = ''
  scrollToBottom()

  // 3. 开启加载状态 (UI 逻辑)
  isTyping.value = true

  try {
    // 4. 准备上下文数据
    const contextHistory = messages.value.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : msg.role, 
      content: msg.content
    }))

    // 5. 【关键修改】调用 API 文件里的方法
    // 只需要这一行，不需要再写 fetch、headers、正则表达式了
    const aiReply = await chatWithAI(contextHistory, MODEL_NAME)

    // 6. 上屏 AI 消息 (UI 逻辑)
    messages.value.push({ 
      role: 'assistant', 
      content: aiReply, 
      time: getCurrentTime() 
    })

  } catch (error) {
    // 7. 错误处理 (UI 逻辑)
    messages.value.push({ 
      role: 'assistant', 
      content: `(系统错误) 请检查 Ollama 是否运行或模型名称是否正确。`, 
      time: getCurrentTime() 
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}


onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  display: flex; flex-direction: column; height: 100%;
  position: relative;
}

/* 聊天列表 scroll */
.chat-list {
  flex: 1; overflow-y: auto; padding: 15px;
  padding-bottom: 80px; /* 给底部输入框留位置 */
}

.message-item {
  display: flex; margin-bottom: 20px;
}
.message-item.my-msg { flex-direction: row-reverse; }

.avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: #e0e0e0; display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.avatar.user { background: #3a7bd5; color: white; }

.bubble {
  max-width: 70%; padding: 12px 16px; border-radius: 12px;
  position: relative; font-size: 14px; line-height: 1.5;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.ai-msg .bubble {
  background: white; margin-left: 10px; border-top-left-radius: 2px; color: #333;
}
.my-msg .bubble {
  background: #3a7bd5; margin-right: 10px; border-top-right-radius: 2px; color: white;
}

.time {
  font-size: 10px; margin-top: 5px; opacity: 0.6; text-align: right;
}
.my-msg .time { color: rgba(255,255,255,0.8); }

/* 输入框区域 */
.input-area {
  position: fixed; bottom: 60px; left: 0; right: 0; /* 60px 是底部导航栏高度 */
  height: 60px; background: #f9f9f9; border-top: 1px solid #e0e0e0;
  display: flex; align-items: center; padding: 0 15px;
  z-index: 99; max-width: 600px; margin: 0 auto;
}

.input-area input {
  flex: 1; height: 36px; border: 1px solid #ddd; border-radius: 18px;
  padding: 0 15px; outline: none; transition: 0.3s;
}
.input-area input:focus { border-color: #3a7bd5; }

.input-area button {
  margin-left: 10px; background: #3a7bd5; color: white; border: none;
  padding: 8px 16px; border-radius: 18px; font-size: 13px; font-weight: bold;
  cursor: pointer;
}
.input-area button:disabled { background: #ccc; }

/* 打字动画 */
.typing span { animation: blink 1.4s infinite both; font-size: 20px; line-height: 10px;}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
</style>
