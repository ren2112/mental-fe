<template>
  <div class="container">
    <!-- 头部区域 -->
    <header class="header">
      <!-- 头部用户信息展示 -->
      <div class="profile">
        <div class="avatar">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="Avatar" />
        </div>
        <div class="info">
          <p>姓名: {{ userInfo.username }}</p>
          <p>邮箱: {{ userInfo.email }}</p>
          <p>部门: {{ departmentName }}</p>
        </div>
      </div>
      <div class="buttons">
        <el-button type="success" class="edit" @click="goToEditProfile">编辑资料</el-button>
        <el-button type="success" class="manage" @click="goToAdminPanel">管理系统</el-button>
        <el-button type="danger" class="logout" @click="logout">退出登录</el-button>
      </div>
    </header>

    <!-- Tabs 和 帖子列表容器 -->
    <div class="content-container">
      <div class="tabs-container">
        <el-tabs v-model="activeTab" @tab-change="changeFetchPosts" class="custom-tabs">
          <el-tab-pane label="已发布" name="published"></el-tab-pane>
          <el-tab-pane label="审核中" name="underReview" v-if="isCurrentUser"></el-tab-pane>
          <el-tab-pane label="未通过" name="notPassed" v-if="isCurrentUser"></el-tab-pane>
          <el-tab-pane label="已删除" name="delete" v-if="isCurrentUser"></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 帖子列表 -->
      <div class="post-list">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>

    <!-- 底部导航 -->
    <FooterNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSelfPostsAPI, getdelPostsAPI } from "@/api/post";
import { getUserAPI } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import PostItem from "@/components/moble/postCard.vue";
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const userId = route.query.id;
const posts = ref([]);
const activeTab = ref("published");
const userInfo = ref({
  username: "加载中...",
  email: "",
  department: "",
  avatar: "",
});
const isCurrentUser = ref(true); // 是否是当前用户

// 当前用户的ID
const authStore = useAuthStore();
const currentUser = computed(() => authStore.userInfo);

// 判断当前用户和查询用户是否一致
const isCurrentUserCheck = computed(() => currentUser.value.id == userId);

// 部门映射
const departmentMap = {
  0: "区团委",
  1: "社区团组织",
  2: "高校团组织",
  3: "企业团组织",
};

// 显示用户部门名称
const departmentName = computed(() => {
  return departmentMap[userInfo.value.department] || "未知部门";
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserAPI(userId);
    userInfo.value = res.data.user;
  } catch (error) {
    ElMessage.error("获取用户信息失败");
  }
};

// 获取帖子数据
const fetchPosts = async () => {
  try {
    const params = {
      userID: userId,
      pageNum: 1,
      pageSize: 4,
      token: authStore.token,
    };

    if (activeTab.value === "published") {
      params.isAudit = 1; // 已发布
    } else if (activeTab.value === "underReview") {
      params.isAudit = 0; // 审核中
    } else if (activeTab.value === "notPassed") {
      params.isAudit = 2; // 未通过
    } else if (activeTab.value === "delete") {
      params.isAudit = 3; // 已删除
    }

    const res = await getSelfPostsAPI(params);
    posts.value = res.data.posts;
  } catch (error) {
    ElMessage.error("获取帖子失败");
  }
};

// Tab 切换时获取数据
const changeFetchPosts = async () => {
  await fetchPosts();
};

// **跳转到编辑资料**
const goToEditProfile = () => {
  router.push({ path: "/mob/edit", query: { id: userId } });
};

// **跳转到管理系统**
const goToAdminPanel = () => {
  router.push("/mob/");
};

// **退出登录**
const logout = () => {
  authStore.clearToken();
  router.push("/mob/beginning");
};

// 页面初始化时获取用户信息和帖子
onMounted(async () => {
  await fetchUserInfo();
  await fetchPosts();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
  height: 100vh;
}

.content-container {
  width: 90%;
  max-width: 100%;
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  flex: 1;
  box-sizing: border-box;
}

.header {
  width: 100%;
  background: #008241;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
}

.profile {
  display: flex;
  align-items: center;
  width: 90%;
  margin-left: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  overflow: hidden; /* 确保图片超出部分不显示 */
  margin-right: 15px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片填充容器并且居中 */
}


.info p {
  margin: 4px 0;
}

.buttons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.tabs-container {
  width: 100%;
}

.custom-tabs {
  width: 100%;
  min-width: 300px;
}

:deep(.el-tabs__header) {
  display: flex;
  justify-content: center;
}

:deep(.el-tabs__nav-wrap) {
  display: flex;
  justify-content: center;
}

:deep(.el-tabs__nav) {
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  padding: 5px;
}

.post-list {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-sizing: border-box;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #008241;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
}
</style>
