<template>
  <div class="layout">
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-left">
          <router-link to="/index" class="nav-item home">
            <el-icon><House /></el-icon>
            首页
          </router-link>
          <div class="site-title">高新区团系统工作平台</div>
        </div>
        <div class="nav-right">
          <router-link to="/post" class="nav-item">
            <el-icon><Edit /></el-icon>
            发个帖子
          </router-link>
          <!-- <router-link to="/message" class="nav-item">
            <el-icon><Message /></el-icon>
            消息
          </router-link> -->
          <router-link
            :to="{ path: '/my-home-page', query: { id: authStore.userInfo?.id?.toString() || '' } }"
            class="nav-item user"
            v-if="authStore.token !== '' && authStore.userInfo"
          >
            <el-icon><User /></el-icon>
            <span class="username">{{ authStore.userInfo?.username || '用户' }}</span>
          </router-link>

          <router-link to="/login" class="nav-item" v-else>
            <el-icon><User /></el-icon>
            登录
          </router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { House, Edit, Message} from '@element-plus/icons-vue'
import {ref,onMounted} from 'vue';
import type {User} from '@/type/user'
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const userInfo = ref<User | null>(null);

// 异步函数获取用户数据
const fetchUserInfo = async () => {
  if (authStore.token != '') {
    try {
      authStore.refreshUserInfo()
      if(authStore.userInfo){
        userInfo.value = authStore.userInfo
      }
      console.log(userInfo.value);
      
    } catch (error) {
    }
  }
};

// 在组件挂载时调用
onMounted(async() => {
  await fetchUserInfo();
});
</script>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.nav-bar {
  background: #fff;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100;
}

.nav-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0,130,65,1);
  padding: 0 10vw;
  max-width: 100%;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-left a{
   font-size: 16px;
}

.site-title {
  font-size: 20px; /* 稍微加大字体尺寸 */
  font-weight: 500; /* 加强文字权重以突出标题 */
  color: #fff; /* 使用深蓝灰色提升高级感 */
  margin-left: 100px;
  white-space: nowrap;

  /* 添加背景渐变 */
  background: linear-gradient(to right, #9eb0ee, #489bed);
  -webkit-background-clip: text; /* 兼容旧版WebKit内核 */
  background-clip: text;
 // -webkit-text-fill-color: transparent; /* 让文字显示渐变效果 */

  /* 添加一点文字间距 */
  letter-spacing: 1px;

  /* 动效：鼠标悬停时的效果 */
  transition: transform 0.3s ease, color 0.3s ease;

  /* 添加文本阴影 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* 鼠标悬停时放大一点 */
.site-title:hover {
  transform: scale(1.05);
  color: #4CAF50; /* 更显亮的绿色，增加互动性 */
}


.nav-item {
  text-decoration: none;
  color: white;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
 

  &:hover {
    transform: scale(1.15);
  }

  .el-icon {
    font-size: 24px;
    color:white;
  }
}

.user {
  .username {
    margin-left: 4px;
  }
  
  .user-id {
    font-size: 13px;
    color: whitesmoke;
    margin-left: 10px;
  }
}

.main-content {
  flex: 1;
  width: 80vw;
  padding: 5px 1px;
  margin: 0 auto;
  margin-top: 60px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 16px;
  }
  
  .main-content {
    padding: 20px 16px;
  }
  
  .site-title {
    display: none;
  }
  
  .user {
    .user-id {
      display: none;
    }
  }
}
</style>