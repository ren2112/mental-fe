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
        <el-button type="success" class="edit" @click="goToEditProfile" v-if="isCurrentUserCheck">编辑资料</el-button>
        <el-button type="success" class="manage" @click="goToAdminPanel" v-if="isAdmin&&isCurrentUserCheck">管理系统</el-button>
        <el-button type="danger" class="logout" @click="logout" v-if="isCurrentUserCheck">退出登录</el-button>
      </div>
    </header>

    <!-- Tabs 和 帖子列表容器 -->
    <div class="content-container">
      <div class="tabs-container">
        <el-tabs v-model="activeTab" @tab-change="changeFetchPosts" class="custom-tabs">
          <el-tab-pane label="已发布" name="published"></el-tab-pane>
          <el-tab-pane label="审核中" name="underReview" v-if="isCurrentUserCheck"></el-tab-pane>
          <el-tab-pane label="未通过" name="notPassed" v-if="isCurrentUserCheck"></el-tab-pane>
          <el-tab-pane label="已删除" name="delete" v-if="isCurrentUserCheck"></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 帖子列表 -->
      <div class="post-list">
        <PostItem v-for="post in posts" :key="post.id" :post="post" v-if="posts.length>0"/>
        <div class="empty-post" v-else>
          <div class="empty-component">
            <el-icon :size="100" color="rgba(0, 130, 100, 1)"><DocumentDelete /></el-icon> 
            <p>这里空空如也...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <FooterNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSelfPostsAPI, getdelPostsAPI } from "@/api/post";
import { getUserAPI } from "@/api/user";
import { useAuthStore } from "@/stores/auth";
import PostItem from "@/components/moble/postCard.vue";
import FooterNav from "@/views/moble/footer.vue";
import { ElMessage } from "element-plus";
import { throttle } from "lodash";

const route = useRoute();
const router = useRouter();
const userId = route.query.id;
const posts = ref([]);
const activeTab = ref("published");
const pageNum = ref(1);
const pageSize = ref(5);
const isAudit = ref(1);
const totalPosts = ref(0);
const isLoading = ref(false); // 是否正在加载
let curTab = 0;

const userInfo = ref({
  username: "加载中...",
  email: "",
  department: "",
  avatar: "",
});

const authStore = useAuthStore();
const currentUser = computed(() => authStore.userInfo);
const isAdmin = computed(() => currentUser.value.department == 0);
const isCurrentUserCheck = computed(() => currentUser.value.id == userId);

const departmentMap = {
  0: "区团委",
  1: "社区团组织",
  2: "高校团组织",
  3: "企业团组织",
};

const departmentName = computed(() => {
  return departmentMap[userInfo.value.department] || "未知部门";
});

const fetchUserInfo = async () => {
  try {
    const res = await getUserAPI(userId);
    userInfo.value = res.data.user;
  } catch (error) {
    ElMessage.error("获取用户信息失败");
  }
};

const fetchPosts = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    let res;
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      userID: userId,
      token: authStore.token,
    };

    if (curTab === 0) {
      params.isAudit = isAudit.value;
      res = await getSelfPostsAPI(params);
    } else {
      params.SearchQuery = "";
      res = await getdelPostsAPI(params);
    }

    const fetchedPosts = res.data.posts;
    totalPosts.value = res.data.total;

    if (pageNum.value === 1) {
      posts.value = fetchedPosts;
    } else {
      posts.value.push(...fetchedPosts);
    }

    pageNum.value++;
  } catch (error) {
    ElMessage.error("获取帖子失败");
  } finally {
    isLoading.value = false;
  }
};

const changeFetchPosts = async (tabName) => {
  pageNum.value = 1;

  if (tabName === "delete") {
    curTab = 1;
  } else {
    curTab = 0;
    if (tabName === "published") {
      isAudit.value = 1;
    } else if (tabName === "underReview") {
      isAudit.value = 0;
    } else if (tabName === "notPassed") {
      isAudit.value = 2;
    }
  }

  await fetchPosts();
};

const handleScroll = () => {
  const scrollContainer = document.documentElement;
  const bottomOffset = 150;

  if (
    scrollContainer.scrollHeight - scrollContainer.scrollTop - window.innerHeight <
    bottomOffset
  ) {
    if (posts.value.length < totalPosts.value) {
      fetchPosts();
    }
  }
};

const throttledScroll = throttle(handleScroll, 300);

const goToEditProfile = () => {
  router.push({ path: "/mob/edit", query: { id: userId } });
};

const goToAdminPanel = () => {
  router.push("/mob/manage");
};

const logout = () => {
  authStore.clearToken();
  router.push("/mob/beginning");
};

onMounted(async () => {
  await fetchUserInfo();
  await fetchPosts();
  window.addEventListener("scroll", throttledScroll);
  console.log(currentUser.department);
  
});

onUnmounted(() => {
  window.removeEventListener("scroll", throttledScroll);
});
</script>


<style scoped>
.container {
  /* min-width: 400px; */
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
  /* min-width: 300px; */
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
  overflow-y: auto;
  min-height: calc(100vh - 300px); /* 让列表区域撑起页面高度以便滚动 */
}


.empty-post {
  text-align: center;
}

.empty-component p {
  margin-top: 1vh;
  font-size: 2vh;
  color: #666;
}


/* .footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #008241;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
} */

</style>
