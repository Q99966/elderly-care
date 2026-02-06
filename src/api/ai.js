export async function chatWithAI(messages, modelName = 'deepseek-r1') {
    try {
      const response = await fetch('/ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          messages: messages, // 格式: [{role: 'user', content: '...'}]
          stream: false
        })
      })
  
      if (!response.ok) throw new Error('AI 服务连接失败')
      
      const data = await response.json()
      // 统一处理 <think> 标签清洗逻辑
      const cleanContent = data.message.content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
      
      return cleanContent
    } catch (error) {
      console.error('AI API Error:', error)
      throw error // 抛出错误让 UI 层处理
    }
  }