<template>
  <div class="container">
    <header class="header">编辑个人主页</header>

    <div class="avatar-section">
      <img :src="picSrc" alt="头像" class="avatar" />
      <input type="file" id="avatar-upload" style="display: none" @change="onFileSelected" />
      <el-button type="primary" class="btn-avatar" @click="onAvatarChangeClick">修改头像</el-button>
    </div>

    <div class="info-section">
      <label>修改用户名</label>
      <input type="text" v-model="username" placeholder="输入新用户名" />

      <label>修改邮箱</label>
      <input type="email" v-model="email" placeholder="输入新邮箱" />
      <div class="btn-container">
        <el-button type="primary" class="btn-save-name" @click="saveName">修改</el-button>
      </div>
    </div>

    <div class="password-section">
      <label>修改密码</label>
      <input type="password" v-model="password" placeholder="输入新密码" />
      <input type="password" v-model="confirmPassword" placeholder="再次输入新密码" />

      <div class="verification-section">
        <div class="input-verify">
          <input type="text" v-model="verificationCode" placeholder="输入验证码" />
        </div>
        <el-button type="primary" class="btn-send-code" @click="sendVerificationCode" :disabled="isSending">
          {{ isSending ? "发送中..." : "获取验证码" }}
        </el-button>
      </div>

      <div class="btn-container">
        <el-button type="primary" class="btn-update-password" @click="updatePassword">修改</el-button>
      </div>
    </div>

    <FooterNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import { uploadAvatarAPI, getUserAPI, updateSelfUserAPI, updatePasswordAPI, sendVerifyCodeAPI } from '@/api/user';

const authStore = useAuthStore();
const picSrc = ref(""); // 头像路径
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const verificationCode = ref("");
const isSending = ref(false);

// 获取用户信息
const fetchUser = async () => {
  try {
    const res = await getUserAPI(authStore.userInfo.id);
    if (res.code === 0) {
      picSrc.value = res.data.user.avatar;
      username.value = res.data.user.username;
      email.value = res.data.user.email;
    } else {
      ElMessage.success("获取用户信息失败");
    }
  } catch (error) {
    ElMessage.success("获取用户信息失败，请稍后重试");
  }
};

// 修改头像
const onAvatarChangeClick = () => {
  document.getElementById("avatar-upload").click();
};

const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const res = await uploadAvatarAPI(file);
    if (res.code === 0) {
      picSrc.value = res.data.fileUrl;
      ElMessage.success("头像上传成功");
      await fetchUser();
    } else {
      ElMessage.success(res.msg || "头像上传失败");
    }
  } catch (error) {
    ElMessage.success("头像上传失败，请稍后重试");
  }
};

// 修改用户名或邮箱
const saveName = async () => {
  if (!username.value) {
    return ElMessage.warning("请输入用户名");
  }
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return ElMessage.error("请输入正确的邮箱");
  }

  try {
    const res = await updateSelfUserAPI({
      id: authStore.userInfo.id,
      username: username.value,
      email: email.value,
    });
    if (res.code === 0) {
      ElMessage.success("修改成功！");
      authStore.refreshUserInfo();
    } else {
      ElMessage.success(res.msg || "修改失败");
    }
  } catch (error) {
    ElMessage.success("修改失败，请稍后重试");
  }
};

// 发送验证码
const sendVerificationCode = async () => {
  if (!email.value) {
    return ElMessage.success("请输入邮箱");
  }

  isSending.value = true;
  try {
    const res = await sendVerifyCodeAPI({ email: email.value });
    if (res.code === 0) {
      ElMessage.success("验证码已发送");
    } else {
      ElMessage.warning(res.msg || "验证码发送失败");
    }
  } catch (error) {
    ElMessage.warning("验证码发送失败，请稍后重试");
  } finally {
    isSending.value = false;
  }
};

// 修改密码
const updatePassword = async () => {
  if (!password.value || !confirmPassword.value) {
    return ElMessage.success("密码不能为空");
  }
  if (password.value !== confirmPassword.value) {
    return ElMessage.success("两次密码输入不一致");
  }
  if (!verificationCode.value) {
    return ElMessage.success("请输入验证码");
  }

  try {
    const res = await updatePasswordAPI({
      password: password.value,
      email: email.value,
      verifyCode: verificationCode.value,
    });

    if (res.code === 0) {
      ElMessage.success("密码修改成功！");
      password.value = "";
      confirmPassword.value = "";
      verificationCode.value = "";
    } else {
      ElMessage.success(res.msg || "密码修改失败");
    }
  } catch (error) {
    ElMessage.success("密码修改失败，请稍后重试");
  }
};

onMounted(fetchUser);
</script>

<style scoped>
.container {
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
  line-height: 60px;
  font-size: 18px;
  border-radius: 0 0 20px 20px;
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
  border-radius: 50%;
  object-fit: cover;
  background: #ddd;
  margin-bottom: 10px;
}

.info-section, 
.password-section {
  width: 90%;
  max-width: 350px;
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
  text-align: left;
}

input {
  width: 100%;
  max-width: 330px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  height: 38px;
  display: block;
  margin-bottom: 10px;
}

.verification-section {
  display: flex;
  /* width: 100%;
  margin: 0 auto; */
}

.verification-section input {
  flex: 1;
  width: 170px;
  height: 38px;
}
.btn-send-code{
  margin-left: 10px;
  width: 150px;
  height: 38px;
}

.btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}

.btn-save-name{
  width: 200px;
}
.btn-update-password{
  width: 200px;
}

button{
  height: 38px;
}


</style>
