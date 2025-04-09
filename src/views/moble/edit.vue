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
        <el-button
          type="primary"
          class="btn-send-code"
          @click="sendVerificationCode"
          :disabled="isSending"
        >
          {{ isSending ? `${countdown}秒后重试` : "获取验证码" }}
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

const countdown = ref(60); // 倒计时初始值
let timer = null;

// 发送验证码
const sendVerificationCode = async () => {
  if (!email.value) {
    return ElMessage.success("请输入邮箱");
  }

  isSending.value = true;
  countdown.value = 60;
  startCountdown();

  try {
    const res = await sendVerifyCodeAPI({ email: email.value });
    if (res.code === 0) {
      ElMessage.success("验证码已发送");
    } else {
      ElMessage.warning(res.msg || "验证码发送失败");
      clearInterval(timer); // 失败时取消倒计时
      isSending.value = false;
    }
  } catch (error) {
    ElMessage.warning("验证码发送失败，请稍后重试");
    clearInterval(timer);
    isSending.value = false;
  }
};

// 倒计时函数
const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isSending.value = false;
    }
  }, 1000);
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
  padding-bottom: 8vh;
}

.header {
  width: 100%;
  height: 8vh;
  background: rgba(0, 130, 65, 1);
  color: white;
  text-align: center;
  line-height: 8vh;
  font-size: 2.2vh;
  border-radius: 0 0 2.5vh 2.5vh;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vh;
}

.avatar {
  width: 10vh;
  height: 10vh;
  border-radius: 50%;
  object-fit: cover;
  background: #ddd;
  margin-bottom: 1.5vh;
}

.info-section,
.password-section {
  width: 90%;
  max-width: 350px;
  background: white;
  border-radius: 8px;
  padding: 2vh;
  box-shadow: 0px 0.3vh 0.6vh rgba(0, 0, 0, 0.1);
  margin-top: 3vh;
}

label {
  display: block;
  margin: 1.5vh 0 1vh;
  font-size: 1.6vh;
  text-align: left;
}

input {
  width: 100%;
  max-width: 330px;
  padding: 1.2vh;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  height: 5vh;
  display: block;
  margin-bottom: 1.5vh;
}

.verification-section {
  display: flex;
}

.verification-section input {
  flex: 1;
  width: 20vh;
  height: 5vh;
}

.btn-send-code {
  margin-left: 1.5vh;
  width: 18vh;
  height: 5vh;
}

.btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1.5vh;
}

.btn-save-name,
.btn-update-password {
  width: 25vh;
}

button {
  height: 4vh;
}

</style>
