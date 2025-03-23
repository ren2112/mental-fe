<template>
  <div class="background_container">
      <div class="items_container">
          <div class="left_container">
              <!-- 背景图片 -->
              <img class="background_image" src="@/assets/hitechmbg01.jpg" alt="背景图片" />
              <!-- logo 图片 -->
              <img class="logo_image" src="@/assets/logo_img.png" alt="Logo" />
          </div>
          <div class="right_container">
              <div class="title_box">
                  <h1>用 户 登 录</h1>
              </div>
              <div class="input_box">                  
                  <input type="text" class="input" v-model="email" placeholder="请输入邮箱">
              </div>
              <div class="input_box">
                  <input type="password" class="input" v-model="password" placeholder="请输入密码">
              </div>
              <div class="btn_box">
                  <div class="login_box">
                      <button class="login_btn" @click="handleLogin">登 录</button>
                  </div>
                  <div class="router_box">
                      <div class="register_box">
                        <RouterLink to="/register" class="router_text">注册账号</RouterLink>
                      </div>
                      <div class="back_box">
                        <RouterLink to="/" class="router_text">返回首页</RouterLink>
                      </div>
                  </div>
              </div>
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
    router.replace('/index'); // 跳转到仪表盘或其他页面
  } catch (error) {
    // ElMessage.error(error || '网络错误，请稍后重试');
    // alert(error || '网络错误，请稍后重试');
  }
};
</script>

<style scoped>
.background_container{
    width: 100%;
    height: 800px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
}
.items_container{
    width: 1400px;
    height: 700px;
    display: flex;
    box-shadow: 0 4px 4px 4px rgba(0,0,0,0.1);
}
.left_container {
  position: relative;
  width: 950px;
  height: 700px;
  overflow: hidden; /* 防止图片溢出容器 */
}

.background_image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片自适应充满容器 */
  z-index: 1; /* 背景图片层级 */
}

.logo_image {
  position: absolute;
  top: 50px; /* 距离容器顶部的距离 */
  left: 50px; /* 距离容器左侧的距离 */
  width: 600px; /* 放大 logo 图片的宽度 */
  height: auto; /* 高度自动缩放，保持比例 */
  z-index: 2; /* logo 层级高于背景图片 */
}


.right_container{
  width: 450px;
  height: 700px;
  background-color: white;
}
.title_box{
  width: 400px;
  height: 100px;
  margin: 10px 25px;
  margin-top: 70px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input_box{
  width: 400px;
  height: 90px;
  margin: 20px 25px;
  display: flex;
  align-items: center;
}
.btn_box{
  width: 400px;
  height: 100px;
  margin: 30px 25px;
}
.input{
  width: 390px;
  height: 40px;
  font-size: 20px;
  outline: none;
  border: transparent;
  border-bottom: 2px solid rgba(0,130,65,1);
  margin: 5px 5px;
}

.login_box{
  width: 400px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.router_box{
  width: 400px;
  height: 30px;
  display: flex;
}
.login_btn{
  width: 390px;
  height: 40px;
  background-color: rgba(0,130,65,0.8);
  font-size: 20px;
  color: white;
  border: 1px solid rgba(0,130,65,1);
  border-radius: 5px;
  transition: background-color 0.3s;
}
.login_btn:hover{
  background-color: rgba(0,130,65,1);
}
.back_box{
  width: 100px;
  height: 30px;
  margin-left: 260px;
}
.register_box{
  width: 100px;
  height: 30px;
}
.router_text{
  text-decoration: none;
  color:darkcyan;
}

h1{
  font-size: 40px;
  color: rgba(0,130,65,1);
}

@media(max-width:768px){
  .left_container {
    display:none
  }
  .right_container{
    scale:0.8
  }
}
</style>