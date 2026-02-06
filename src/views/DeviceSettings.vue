<template>
  <div class="settings-page">
    
    <div class="setting-group">
      <div class="group-title">安全防护</div>
      <div class="setting-item">
        <div class="item-info">
          <span class="label">跌倒检测报警</span>
          <span class="sub-label">检测到跌倒自动呼叫紧急联系人</span>
        </div>
        <div class="switch" :class="{ active: isFallDetectionOn }" @click="isFallDetectionOn = !isFallDetectionOn">
          <div class="switch-handle"></div>
        </div>
      </div>

      <div class="setting-item" v-if="isFallDetectionOn">
        <span class="label">检测灵敏度</span>
        <select v-model="sensitivity" class="custom-select">
          <option value="low">低 (防误触)</option>
          <option value="medium">中 (推荐)</option>
          <option value="high">高 (高风险)</option>
        </select>
      </div>
    </div>

    <div class="setting-group">
      <div class="group-title">SOS 紧急联系人 (优先级排序)</div>
      <div class="contact-list">
        <div class="contact-item" v-for="(contact, index) in contacts" :key="index">
          <div class="avatar">{{ contact.name[0] }}</div>
          <div class="info">
            <div class="name">{{ contact.name }}</div>
            <div class="phone">{{ contact.phone }}</div>
          </div>
          <button class="delete-btn" @click="removeContact(index)">移除</button>
        </div>
        
        <div class="add-contact-btn" @click="addContact">
          <span>+ 添加紧急联系人</span>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="group-title">设备维护</div>
      <div class="menu-item" @click="findDevice">
        <span>🔔 寻找手环 (播放声音)</span>
        <span class="arrow">></span>
      </div>
      <div class="menu-item" @click="remoteRestart">
        <span>🔄 远程重启设备</span>
        <span class="arrow">></span>
      </div>
    </div>

    <button class="logout-btn" @click="handleLogout">退出登录</button>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isFallDetectionOn = ref(true)
const sensitivity = ref('medium')
const contacts = ref([
  { name: '王建国 (儿子)', phone: '138****0001' },
  { name: '刘淑芬 (女儿)', phone: '139****8888' }
])

const removeContact = (index) => {
  if(confirm('确定移除该联系人吗？')) contacts.value.splice(index, 1)
}

const addContact = () => {
  const name = prompt('输入姓名')
  const phone = prompt('输入电话')
  if(name && phone) contacts.value.push({ name, phone })
}

const findDevice = () => alert('指令已下发：手环正在鸣叫...')
const remoteRestart = () => alert('指令已下发：设备正在重启')
const handleLogout = () => {
  if(confirm('确定退出登录吗？')) router.push('/login')
}
</script>

<style scoped>
.setting-group { background: white; border-radius: 12px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.group-title { padding: 15px 15px 5px; font-size: 13px; color: #999; font-weight: bold; }

.setting-item { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5; }
.setting-item:last-child { border-bottom: none; }
.item-info { display: flex; flex-direction: column; }
.label { font-size: 16px; color: #333; }
.sub-label { font-size: 12px; color: #999; margin-top: 4px; }

/* 开关样式 */
.switch { width: 50px; height: 30px; background: #e0e0e0; border-radius: 15px; position: relative; transition: 0.3s; cursor: pointer; }
.switch.active { background: #3a7bd5; }
.switch-handle { width: 26px; height: 26px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.switch.active .switch-handle { left: 22px; }

.custom-select { border: none; background: #f5f5f5; padding: 5px 10px; border-radius: 8px; color: #3a7bd5; font-weight: bold; outline: none;}

/* 联系人列表 */
.contact-item { padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #f5f5f5; }
.avatar { width: 40px; height: 40px; background: #e1f5fe; color: #0288d1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; }
.info { flex: 1; }
.name { font-size: 16px; font-weight: 500; }
.phone { font-size: 13px; color: #666; }
.delete-btn { background: none; border: 1px solid #ff5252; color: #ff5252; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
.add-contact-btn { padding: 15px; text-align: center; color: #3a7bd5; font-weight: bold; cursor: pointer; }

/* 菜单项 */
.menu-item { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.menu-item:active { background: #f9f9f9; }
.arrow { color: #ccc; }

.logout-btn { width: 100%; background: white; color: #ff5252; border: none; padding: 15px; font-size: 16px; font-weight: bold; border-radius: 12px; margin-top: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
</style>