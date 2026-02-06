<template>
  <nav class="bottom-nav">
    <router-link to="/dashboard" class="nav-item">
      <span class="icon">🏠</span>
      <span class="label">监控</span>
    </router-link>
    <router-link to="/ai" class="nav-item">
      <span class="icon">🤖</span>
      <span class="label">助手</span>
    </router-link>
    <router-link to="/settings" class="nav-item">
      <span class="icon">⚙️</span>
      <span class="label">设置</span>
    </router-link>
  </nav>
</template>

<style scoped>
/* 把之前 App.vue 里底部的 CSS 剪切到这里 */
.bottom-nav {   
    position: fixed; bottom: 0; left: 0; right: 0; max-width: 600px; margin: 0 auto;
    height: 60px; background: #fff;
    display: flex; justify-content: space-around; align-items: center;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    z-index: 100; }
.nav-item { 
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-decoration: none; color: #999; font-size: 12px;
}
.nav-item .icon { font-size: 20px; margin-bottom: 2px; filter: grayscale(100%); }
.nav-item.router-link-active { color: #1989fa; }
.nav-item.router-link-active .icon { filter: grayscale(0); }
</style>