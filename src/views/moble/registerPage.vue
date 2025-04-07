<template>
    <div class="register-container">
      <div class="register-box">
        <h1 class="register-title">用户注册</h1>
  
        <!-- 输入部分 -->
        <div class="input-group">
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="form-input"
          />
          <input
            v-model="email"
            type="email"
            placeholder="请输入电子邮箱"
            class="form-input"
          />
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请确认密码"
            class="form-input"
          />
          <div class="verification-group">
            <input
              v-model="captcha"
              type="text"
              placeholder="请输入验证码"
              class="form-input verification-input"
            />
            <button class="send-code-btn" @click="sendCaptcha">发送验证码</button>
          </div>
        </div>

        <button class="register-btn" @click="register">注 册</button>
  
        <!-- 跳转链接 -->
        <div class="link-group">
          <router-link to="/mob/login" class="nav-link">用户登录</router-link>
          <router-link to="/mob/beginning" class="nav-link">返回首页</router-link>
        </div>
      </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/router';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const captcha = ref('');
const url1 = 'http://localhost:8082/api/noauth/request-code';
const url2 = 'http://localhost:8082/api/noauth/register';

const sendCaptcha = async() =>{
  if(!email.value){
    ElMessage.warning("邮箱不能为空！");
    return;
  }

  try{
    const response = await axios.post(url1,{email:email.value});
    if(response.data.code===0){
      ElMessage.success(response.data.msg+"至:"+ email.value);
    }else{
      ElMessage.error(response.data.msg || "验证码发送失败");
    }
  }catch(error){
    ElMessage.error(error || "网络错误，请稍后重试");
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
      setTimeout(()=>{
        router.push('/mob/login');
      },500);
    }else{
      ElMessage.error(response.data.msg || "注册失败");
    }
  }catch(error){
    ElMessage.error(error || "网络错误，请稍后重试");
  }
}
</script>
  
<style scoped>
  .register-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-image: url('@/assets/bg.jpg'); 背景图片*/
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .register-box {
    background: rgba(255, 255, 255, 0.9);
    width: 90vw;
    min-width: 330px;
    max-width: 400px;
    height: auto;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
  
  .register-title {
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
  }
  
  .form-input {
    width: 100%;
    padding: 8px 12px;
    outline: none;
    border: transparent;
    border-bottom: 2px solid rgba(0,130,65);
    font-size: 0.95rem;
    color: #333;
    line-height: 1.5;
    box-sizing: border-box;
    min-height: 44px;
  }
  
  /* 验证码输入组样式 */
  .verification-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .verification-input {
    flex: 1;
    max-width: 50%;
  }
  
  .send-code-btn {
    flex: 1;
    background: rgba(0,130,65);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 0.9rem;
    min-height: 44px;
    cursor: pointer;
    transition: opacity 0.3s;
  }
  
  .send-code-btn:active {
    opacity: 0.8;
  }
  
  /* 注册按钮样式 */
  .register-btn {
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
  
  .register-btn:active {
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
  
  /* 响应式调整 */
  @media (max-width: 480px) {
    .register-box {
      width: 95vw;
      padding: 1rem;
    }
  
    .form-input {
      min-height: 40px;
      padding: 6px 10px;
    }
  
    .send-code-btn {
      font-size: 0.85rem;
      padding: 6px 10px;
      min-height: 40px;
    }
  }
</style>