<template>
  <div class="background">
    <div class="items_container">

      <div class="left_container">
          <!-- 背景图片 -->
          <img class="background_image" src="@/assets/hitechmbg01.jpg" alt="背景图片" />
          <!-- logo 图片 -->
          <img class="logo_image" src="@/assets/logo_img.png" alt="Logo" />
      </div>

      <div class="right_container">
        <div class="container">
            <h1 class="title">用 户 注 册</h1>
            <div class="form-group">
                <!-- <label class="label">用户名</label> -->
                <input v-model="username" type="text" placeholder="请输入用户名" class="input"/>
            </div>

            <div class="form-group">
                <!-- <label class="label">电子邮箱</label> -->
                <input v-model="email" type="email" placeholder="请输入电子邮箱" class="input"/>
            </div>

            <div class="form-group">
                <!-- <label class="label">密码</label> -->
                <input v-model="password" type="password" placeholder="请输入密码" class="input"/>
            </div>

            <div class="form-group">
                <!-- <label class="label">确认密码</label> -->
                <input v-model="confirmPassword" type="password" placeholder="请确认密码" class="input"/>
            </div>

            <div class="form-group">
                <!-- <label class="label">验证码</label> -->
                <div class="captcha-container">
                    <input v-model="captcha" type="text" placeholder="请输入验证码" class="captcha-input"/>
                    <button @click="sendCaptcha" class="captcha-button">发送验证码</button>
                </div>
            </div>

            <button @click="register" class="register-button">注册</button>
            <div class="loginlink">
                <router-link to="/login" class="go-to-login">返回登录</router-link>
                <router-link to="/" class="go_to_homelink back_homelink">返回首页</router-link>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const captcha = ref('');
const url1 = 'http://localhost:8082/api/noauth/request-code';
const url2 = 'http://localhost:8082/api/noauth/register';
const router = useRouter();

const sendCaptcha = async() =>{
  if(!email.value){
    ElMessage.warning("邮箱不能为空！");
    return;
  }

  try{
    const response = await axios.post(url1,{email:email.value});
    if(response.data.code===0){
      ElMessage.success(response.data.msg+"至:"+ email.value);
      // alert(response.data.msg+"至:"+ email.value);
    }else{
      ElMessage.error(response.data.msg || "验证码发送失败");
      // alert(response.data.msg || "验证码发送失败");
    }
  }catch(error){
    ElMessage.error(error || "网络错误，请稍后重试");
    // alert(error || "网络错误，请稍后重试");
  }
};
const register = async() =>{
  if(!username.value){
    ElMessage.warning("用户名不能为空！");
    return;
  }
  if(!email.value){
    ElMessage.warning("邮箱不能为空！");
    return;
  }
  if(!password.value){
    ElMessage.warning("密码不能为空！");
    return;
  }
  if(!confirmPassword.value){
    ElMessage.warning("请确认密码！");
    return;
  }
  if(password.value!==confirmPassword.value){
    ElMessage.error("密码与确认密码不一致！");
    return;
  }
  if(!captcha.value){
    ElMessage.warning("请输入验证码！");
    return;
  }

  try{
    const response = await axios.post(url2,
      {
        "username":username.value,
        "email":email.value,
        "password":password.value,
        "repassword":confirmPassword.value,
        "verifyCode":captcha.value,
      }
    );
    if(response.data.code===0){
      ElMessage.success(response.data.msg);
      // alert(response.data.msg);
    }else{
      ElMessage.error(response.data.msg || "注册失败");
      // alert(response.data.msg || "注册失败");
    }
  }catch(error){
    ElMessage.error(error || "网络错误，请稍后重试");
    // alert(error || "网络错误，请稍后重试");
  }
}
</script>

<style scoped>
.background {
  width: 100%;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.items_container{
  width: 1400px;
  height: 700px;
  display: flex;
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  width: 450px; 
  height: auto; 
  background-color: rgba(255,255,255,1);
  padding: 20px;
}

.title {
  color: rgba(0,130,65,1);
  font-size: 36px; 
  text-align: center;
  margin-bottom: 10px;
  margin-top:5px;
}

.form-group {
  margin-top: 25px;
  margin-bottom: 25px; 
}

.label {
  color: rgba(0,130,65,1);
  font-size: 22px; 
  margin-bottom: 10px; 
}

.input {
  width: 380px; 
  height: 30px; 
  padding: 7px;
  outline: none;
  border: transparent;
  border-bottom: 2px solid rgba(0,130,65,1);
  color: black;
  font-size: 20px;
}

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-input {
  width: 150px; 
  height: 20px; 
  margin-right: 10px;
  padding: 7px;
  outline: none;
  border: transparent;
  border-bottom: 2px solid rgba(0,130,65,1); 
  color: black;
  font-size: 20px;
}

.captcha-button {
  width: 150px; /* 验证码按钮宽度 */
  height: 40px; /* 验证码按钮高度 */
  border-radius: 7px;
  border: 1px solid rgba(0,130,65,1);
  margin-left: 70px;
  color: white;
  background-color: rgba(0,130,65,0.8);
  font-size: 16px; /* 按钮字体大小 */
  cursor: pointer;
  transition: background-color 0.3s;
}
.captcha-button:hover{
  background-color: rgba(0,130,65,1);
}

.register-button {
  width: 100%; /* 注册按钮宽度为100% */
  height: 40px; /* 注册按钮高度 */
  border-radius: 7px;
  border: 1px solid rgba(0,130,65,1);
  color: white;
  background-color: rgba(0,130,65,0.8);
  font-size: 22px; /* 注册按钮字体大小 */
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.register-button:hover{
  background-color: rgba(0,130,65,1);
}

.loginlink{
  margin-top: 10px;
  display: flex;
}
.go-to-login {
  color: darkcyan;
  font-size: 16px;
  cursor: pointer;
  text-align: left; /* 居中对齐 */
  text-decoration: none;
}
.go_to_homelink{
  margin-left: 280px;
}
.back_homelink{
  color: darkcyan;
  text-decoration: none;
}

</style>

