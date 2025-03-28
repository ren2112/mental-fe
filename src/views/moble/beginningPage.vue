<template>
    <div class="container">
      <div class="button-group">
        <router-link to="/mob/login" >
          <button class="auth-btn">账号登录</button>
        </router-link>
        <router-link to="/mob/index" >
          <button class="guest-btn">游客访问</button>
        </router-link>
      </div>
    </div>
</template>
  
<script lang="ts" setup>
</script>
  
<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  /*background-image: url('@/assets/bg.jpg');*/
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  min-width: 370px;
  padding: 0 20px; /* 两侧留白 */
}

button {
  width: 100%;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 1.2rem;
  font-weight: 500;
  color: white;
  background-color: rgba(0,130,65);
  cursor: pointer;
  transition: 
    opacity 0.3s,
    transform 0.2s;
  -webkit-tap-highlight-color: transparent;
}

button:active {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 响应式调整 */
@media (max-width: 375px) {
  button {
    font-size: 1rem;
    padding: 14px 20px;
    border-radius: 25px;
  }
  
  .button-group {
    gap: 12px;
  }
}

/* 超小屏幕优化（如iPhone 5/SE） */
@media (max-width: 320px) {
  button {
    font-size: 0.95rem;
    padding: 12px 18px;
  }
}
</style>