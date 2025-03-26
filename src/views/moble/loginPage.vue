<template>
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">用户登录</h1>
  
        <!-- 输入部分 -->
        <div class="input-group">
          <input
            type="email"
            placeholder="请输入邮箱"
            class="login-input"
            v-model="email"
          />
          <input
            type="password"
            placeholder="请输入密码"
            class="login-input"
            v-model="password"
          />
        </div>
  
        <button class="login-btn" @click="handleLogin">登 录</button>
  
        <div class="link-group">
          <router-link to="/mob/register" class="nav-link">注册账号</router-link>
          <router-link to="/mob/beginning" class="nav-link">返回首页</router-link>
        </div>
      </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus'

const authStore = useAuthStore();
const email = ref(''); // 用户名绑定
const password = ref(''); // 密码绑定
const router = useRouter();

const handleLogin = async () => {
  // 验证账号和密码
  if (!email.value) {
    ElMessage.warning('请输入邮箱')
    return;
  }
  if (!password.value) {
    ElMessage.warning('请输入密码');
    return;
  }

  try {
    // 调用后端接口
    await authStore.login(email.value,password.value)
    ElMessage.success("登录成功")
    router.replace('/mob/index'); // 跳转到仪表盘或其他页面
  } catch (error) {
    ElMessage.error(error || '网络错误，请稍后重试');
  }
};
</script>
  
<style scoped>
  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-image: url('@/assets/bg.jpg');  背景图*/
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-box {
    background: rgba(255, 255, 255, 0.9);
    width: 90vw;
    min-width: 330px;
    max-width: 400px;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
  
  .login-title {
    color: rgba(0,130,65);
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 2rem;
    width: 100%;
  }
  
  .login-input {
    width: 100%;
    outline: none;
    border: transparent;
    border-bottom: 2px solid rgba(0,130,65);
    font-size: 1.2rem;
    transition: border-color 0.3s;
    box-sizing: border-box;
  }
  
  .login-btn {
    width: 100%;
    padding: 10px;
    background: rgba(0,130,65);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.3s;
  }
  
  .login-btn:active {
    opacity: 0.8;
  }
  
  .link-group {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
  }
  
  .nav-link {
    color: rgba(0,130,65);
    font-size: 0.9rem;
    text-decoration: none;
    padding: 8px 12px;
    transition: opacity 0.3s;
  }
  
  .nav-link:active {
    opacity: 0.7;
  }
  
  /* 优化移动端显示 */
@media (max-width: 480px) {
  .login-box {
    width: 95vw; /* 更紧凑的宽度 */
    padding: 1rem; /* 减少内边距 */
  }

  .login-input {
    padding: 10px 12px; /* 调整输入框内边距 */
  }

  .login-title {
    margin-bottom: 1.5rem; /* 减少标题下边距 */
  }
}

/* 超小屏幕适配 */
@media (max-width: 320px) {
  .login-box {
    padding: 0.8rem;
  }

  .login-input {
    font-size: 0.9rem;
  }
}
</style>