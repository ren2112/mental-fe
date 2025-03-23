<template>
  <div class="background-container">
    <!-- 头像修改区域 -->
    <div class="avatar-change-container">
      <div class="avatar-placeholder" :style="{ backgroundImage: `url(${picSrc})` }">
        <img v-if="picSrc" :src="picSrc" />
      </div>
      <button class="avatar-btn" @click="onAvatarChangeClick">修改头像</button>
      <input type="file" id="avatar-upload" class="hidden-file-input" accept="image/*" @change="onFileSelected" style="display: none;">
    </div>

    <!-- 信息修改区域 -->
    <div class="right-info-change-container">
      <!-- 用户名修改 -->
      <div class="other-info-change-container">
        <h3>修改用户名：</h3>
        <div class="input-container">
          <label for="username" class="input-label">用户名:</label>
          <input id="username" class="user-name-input" type="text" placeholder="请输入用户名" v-model="username">
        </div>
        <h3>修改账号邮箱：</h3>
        <div class="input-container">
          <label for="email" class="input-label">邮箱:</label>
          <input id="email" type="email" class="email-input" placeholder="请输入新邮箱" v-model="email">
        </div>
        <div class="btn-container">
          <button class="confirm-btn" @click="saveName">保存</button>
        </div>
      </div>

      <!-- 密码修改 -->
      <div class="password-change-container">
        <h3>修改密码：</h3>
        <div class="input-group">
          <div class="input-container">
            <label for="password" class="input-label">密码:</label>
            <input v-model="password" id="password" type="password" class="password-input" placeholder="请输入密码">
          </div>
          <div class="input-container">
            <label for="confirm-password" class="input-label">确认密码:</label>
            <input v-model="confirmPassword" id="confirm-password" type="password" class="password-input" placeholder="再次输入密码">
          </div>
          <div class="input-container">
            <label for="verification-code" class="input-label">验证码:</label>
            <input v-model="verificationCode" id="verification-code" type="text" class="verifi-input" placeholder="输入验证码">
            <button @click="sendVerificationCode" class="verifi-btn" :disabled="isSending">{{ isSending ? '已发送' : '发送验证码' }}</button>
          </div>
        </div>
        <div class="btn-container">
          <button @click="updatePassword" class="confirm-btn">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import {uploadAvatarAPI, getUserAPI, updateUserAPI, updatePasswordAPI, sendVerifyCodeAPI} from '@/api/user';
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const picSrc = ref('');
const username = ref('');
const email = ref('');
const body = {
  id: '',
  avatar: ''
};
// 表单数据
const password = ref('');
const confirmPassword = ref('');
const verificationCode = ref('');
const isSending = ref(false);
// 发送验证码
const sendVerificationCode = async () => {
  if (!email.value) {
    ElMessage.error('未获取到邮箱，请刷新后重试');
    return;
  }
  isSending.value = true;
  try {
    const res =await sendVerifyCodeAPI({ email: email.value });
    if(res.code === 0){
      ElMessage.success(res.msg);
    }else{
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('发送验证码失败，请稍后重试');
  } finally {
    isSending.value = false;
  }
};

// 更新密码
const updatePassword = async () => {
  console.log('password:', password.value);
  console.log('confirmPassword:', confirmPassword.value);
  console.log('Verification Code:', verificationCode.value);
  if (!password.value || !confirmPassword.value) {
    ElMessage.error('密码不能为空');
    return;
  }
  if (password.value !== confirmPassword.value) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  if (!verificationCode.value) {
    ElMessage.error('验证码不能为空');
    return;
  }
  try {
    const res = await updatePasswordAPI({
      password: password.value,
      email: email.value,
      verifyCode: verificationCode.value,
    });
    if(res.code === 0){
      ElMessage.success(res.msg);
    }
    // 可根据需求清空输入框或跳转页面
    password.value = '';
    confirmPassword.value = '';
    verificationCode.value = '';
  } catch (error) {
    ElMessage.error('密码修改失败，请稍后重试');
  }
};
const onAvatarChangeClick = () => {
  const fileInput = document.getElementById('avatar-upload');
  if (fileInput) {
    fileInput.click(); // 模拟点击隐藏的文件上传控件
  }
};

const onFileSelected = async (event: any) => {
  const file = event.target.files[0]; // 获取用户选择的文件
  if (file) {
    try {
      const response = await uploadAvatarAPI(file);
      ElMessage((response as any).msg);
      body.avatar = response.data.picUrl;
      body.id = authStore.userInfo.id || '';
      const res = await updateUserAPI(body);
      ElMessage((res as any).msg);
      ElMessage.success('头像修改成功！');
    } catch (error) {
      console.error(error);
    }

    // 创建 FileReader 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      // e.target.result 是图片的 base64 数据
      const imgPreview = document.querySelector('.avatar-placeholder');
      if (imgPreview instanceof HTMLElement && e.target?.result) {
        imgPreview.style.backgroundImage = `url(${e.target.result})`;
        imgPreview.textContent = ''; // 清空默认文字
      }
    };
    reader.readAsDataURL(file); // 读取文件为 Base64
  }
};

const saveName = async () => {
  // 邮箱正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username.value) {
    ElMessage.warning("请输入要修改的用户名");
    return;
  }

  if (!email.value || !emailRegex.test(email.value)) {
    ElMessage.error("请输入正确的邮箱");
    return;
  }

  const body = {
    id: authStore.userInfo.id || '',
    username: username.value,
    email: email.value,
  };

  try {
    const res = await updateUserAPI(body);
    if (res.code === 0) {
      ElMessage({
        message: res.msg,
        type: 'success'
      });
      ElMessage.success("修改成功！");
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      });
      ElMessage.error("修改失败！");
    }
    authStore.refreshUserInfo();
  } catch (error) {
    ElMessage.error("修改失败，请稍后重试");
  }
};


// 获取用户信息
const fetchUser = async () => {
  try {
    const res1 = await getUserAPI(authStore.userInfo.id);
    picSrc.value = res1.data.user.avatar;
    username.value = res1.data.user.username; // 设置用户名
    email.value = res1.data.user.email; // 设置邮箱
  } catch (error) {
    ElMessage.error("获取用户信息失败",error);
  }
};

onMounted(async() => {
    await fetchUser();
});
</script>



<style scoped>
.background-container {
  margin: auto;
  display: flex;
  gap: 20px;
  padding: 20px;
  /* background-color: #f9f9f9; */
  /* border-radius: 8px; */
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
  width: 1100px; /* Reduced width for outer card */
  
}

.avatar-change-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 250px; /* Slightly increased width for avatar area */
  padding: 25px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-size: cover; /* 图片自适应填充 */
  background-position: center; /* 图片居中 */
  background-repeat: no-repeat; /* 防止背景重复 */
}

.avatar-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 使图片充满容器并保持比例 */
  object-position: center; /* 居中显示图片 */
}

.avatar-btn {
  background-color: rgba(0, 130, 65, 0.8);
  color: #ffffff;
  border: none;
  padding: 10px 15px; /* Increased padding */
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px; /* Larger font */
  transition: background-color 0.3s;
  margin-top:15px;
}

.avatar-btn:hover {
  background-color: rgba(0, 130, 65, 1);
}

.right-info-change-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.other-info-change-container,
.password-change-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 20px; /* Increased font size */
  margin-bottom: 20px;
  color: #333333;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Increased gap */
}

.input-container {
  display: flex;
  align-items: center;
  gap: 15px; /* Increased gap */
  margin-bottom: 15px;
}
.btn-container{
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-label {
  width: 120px;
  text-align: right;
  font-size: 16px; /* Increased font size */
  color: #666666;
}

.user-name-input,
.password-input,
.verifi-input,
.email-input {
  flex: 1;
  padding: 12px; /* Increased padding */
  font-size: 16px; /* Increased font size */
  border: 1px solid #cccccc;
  border-radius: 5px; /* Slightly rounded border */
  transition: border-color 0.3s;
}

.user-name-input:focus,
.password-input:focus,
.verifi-input:focus,
.email-input:focus {
  border-color: rgba(0, 130, 65, 1);
  outline: none;
}

.confirm-btn {
  width: 200px;
  padding: 5px;
  font-size: 16px; /* Larger font size */
  background-color: rgba(0, 130, 65, 0.8);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-end;
}

.confirm-btn:hover {
  background-color: rgba(0, 130, 65, 1);
}

.verifi-btn {
  padding: 8px 12px; /* Increased padding */
  font-size: 16px; /* Larger font size */
  color: rgba(0, 130, 65, 1);
  border: 1px solid rgba(0, 130, 65, 1);
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.verifi-btn:hover {
  background-color: rgba(0, 130, 65, 1);
  color: #ffffff;
}
</style>
