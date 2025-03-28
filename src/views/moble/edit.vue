<template>
    <div class="container">
      <header class="header">编辑个人主页</header>
      
      <div class="avatar-section">
        <div class="avatar"></div>
        <button class="btn" @click="changeAvatar">修改头像</button>
      </div>
  
      <div class="info-section">
        <label>修改用户名</label>
        <input type="text" v-model="username" placeholder="输入新用户名" />
        
        <label>修改邮箱</label>
        <input type="email" v-model="email" placeholder="输入新邮箱" />
        <button class="btn">修改</button>
      </div>
      
      <div class="password-section">
        <label>修改密码</label>
        <input type="password" v-model="password" placeholder="输入新密码" />
        <input type="password" v-model="confirmPassword" placeholder="再次输入新密码" />
        
        <div class="verification">
          <input type="text" v-model="verificationCode" placeholder="输入验证码" />
          <button class="btn" @click="getVerificationCode">获取验证码</button>
        </div>
        
        <button class="btn">修改</button>
      </div>
      
      <FooterNav />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import FooterNav from "@/views/moble/footer.vue";
  
  const username = ref("");
  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const verificationCode = ref("");
  
  const changeAvatar = () => {
    console.log("修改头像");
  };
  
  const getVerificationCode = () => {
    console.log("获取验证码");
  };
  </script>
  
  <style scoped>
  .container {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background: #f8f8f8;
    padding-bottom: 60px;
  }
  
  .header {
    width: 100%;
    height: 60px;
    background: rgba(0, 130, 65, 1);
    color: white;
    text-align: center;
    padding-top: 20px;
    font-size: 18px;
  }
  
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    background: #ddd;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .info-section, .password-section {
    width: 80%;
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  
  label {
    display: block;
    margin: 10px 0 5px;
    font-size: 14px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .verification {
    display: flex;
    justify-content: space-between;
  }
  
  .verification input {
    flex: 2;
  }
  
  .verification .btn {
    flex: 1;
    margin-left: 10px;
  }
  
  .btn {
    background: rgba(0, 130, 65, 1);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  </style>
  