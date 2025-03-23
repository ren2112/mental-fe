<template>
  <div class="background-container">
    <!-- 左侧用户信息 -->
    <el-card class="left-container" shadow="always">
      <div class="header">
        <div class="avatar-container">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="Avatar" />
        </div>
      </div>

      <div class="user-info">
        <p class="user-info-item"><strong>姓名：</strong>{{ userInfo.username }}</p>
        <el-divider></el-divider>
        <p class="user-info-item"><strong>邮箱：</strong>{{ userInfo.email }}</p>
        <el-divider></el-divider>
        <p class="user-info-item"><strong>部门：</strong>{{ departmentName }}</p>
      </div>

      <!-- 只有是本人查看时才显示这些按钮 -->
      <div v-if="isCurrentUser" class="edit-container">
        <el-space direction="vertical" fill class="button-space">
          <el-button class="sysu-style" size="large" @click="editProfile">编辑资料</el-button>
          <!-- 只有管理员才可以看到用户管理按钮 -->
          <el-button v-if="isAdmin" type="success" size="large" @click="manageUsers">用户管理</el-button>
          <el-button type="danger" size="large" @click="logout">退出登录</el-button>
        </el-space>
      </div>
    </el-card>

    <!-- 右侧内容区 -->
    <el-card class="right-container" shadow="always">
      <!-- 导航栏 -->
      <el-tabs v-model="activeButton" @tab-change="changeFetchPosts">
        <el-tab-pane label="已发布的作品" name="published"></el-tab-pane>
        <el-tab-pane label="审核中的作品" name="underReview" v-if="isCurrentUser"></el-tab-pane>
        <el-tab-pane label="未通过的作品" name="notPassed" v-if="isCurrentUser"></el-tab-pane>
        <el-tab-pane label="已删除的作品" name="delete" v-if="isCurrentUser"></el-tab-pane>
      </el-tabs>

      <!-- 帖子内容 -->
      <el-scrollbar class="work-container">
        <div v-if="posts.length>0" class="main-con">
          <div class="posts-container">
            <PostCard v-for="post in posts" :key="post.id" :post="post" :curTab="curTab" class="single-post" />
          </div>
          <!-- 分页 -->
          <el-pagination
            v-if="totalPosts > 0"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="totalPosts"
            @current-change="handlePageChange"
            layout="prev, pager, next, jumper"
            class="pagination"
          />
        </div>
        <div v-else>
          <div class="empty-post">
            <div class="empty-component">
              <div class="empty-icon">
                <el-icon :size="100" color="rgba(0, 130, 65, 1)"><DocumentDelete /></el-icon>
              </div>
              <div class="empty-text">这里空空如也...</div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSelfPostsAPI,getdelPostsAPI } from '@/api/post';
import { getUserAPI } from '@/api/user';
import { useAuthStore } from '@/stores/auth';
import PostCard from '@/components/PostCard.vue';
import { ElMessage } from 'element-plus';
import { checkNode } from 'element-plus/es/components/cascader-panel/src/utils.mjs';

const userInfo = ref({
  id: '',
  username: '',
  avatar: '',
  email: '',
  phone: '',
  department: '',  // 获取的原始部门字段
});

const route = useRoute();
const router = useRouter();
const userId = route.query.id;
const posts = ref([]);
const activeButton = ref('published');
const pageNum = ref(1);
const pageSize = ref(4);
const totalPosts = ref(0);
const isAudit = ref(1);
const authStore = useAuthStore();
let curTab = 0 // 1代表回收站

// 获取当前用户信息
const currentUser = authStore.userInfo; // 假设当前用户信息存储在 authStore 中

const isCurrentUser = computed(() =>{ 
  return currentUser.id == userId
}); // 判断是否是本人

const isAdmin = computed(() => currentUser.department == 0); // 判断是否是管理员

// 部门映射
const departmentMap = {
  0: '区团委',
  1: '社区团组织',
  2: '高校团组织',
  3: '企业团组织',
};

const departmentName = computed(() => {
  return departmentMap[userInfo.value.department] || '未知部门'; // 如果没有对应部门，则返回 '未知部门'
});

const editProfile = () => router.push('/edit');
const logout = () => {
  authStore.clearToken();
  router.push('/');
};
const manageUsers = () => router.push('/manage');

const changeFetchPosts = async (tabName: string) => {
  pageNum.value = 1;
  if(tabName === 'delete'){
    curTab = 1
  }
  else if (tabName === 'published') {
    isAudit.value = 1;  // 审核通过的作品
    curTab = 0
  } else if (tabName === 'underReview') {
    isAudit.value = 0;  // 未审核的作品
    curTab = 0
  } else if (tabName === 'notPassed') {
    isAudit.value = 2;  // 审核不通过的作品
    curTab = 0
  }
  await fetchPosts();
};

// 获取帖子数据
const fetchPosts = async () => {
  if(curTab === 0){
    try {
      const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        isAudit: isAudit.value,
        userID: route.query.id,
        token: authStore.token,
      };
      const res = await getSelfPostsAPI(params);
      posts.value = res.data.posts;
      totalPosts.value = res.data.total;
    } catch (err) {
        ElMessage.error('获取帖子失败');
      } 
  }else if(curTab === 1){
    try {
      const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        SearchQuery:''
      };
      const res = await getdelPostsAPI(params);
      posts.value = res.data.posts;
      totalPosts.value = res.data.total;
    } catch (err) {
        ElMessage.error('获取帖子失败');
      } 
  }
};

// 获取用户信息
const getUserInfo = async () => {
  const res = await getUserAPI(userId);
  userInfo.value = res.data.user;
};

// 页面初始化
onMounted(async () => {
  await fetchPosts();
  await getUserInfo();
});

// 处理分页
const handlePageChange = (newPage: number) => {
  pageNum.value = newPage;
  fetchPosts();
};
</script>

<style scoped>
.background-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
}

.left-container {
  width: 300px;
  height: auto;
}


.right-container {
  flex: 1;
  ::deep .el-tabs__active-bar{
    background-color:rgba(0, 130, 65, 1);
  }
  ::v-deep .el-tabs__item.is-active {
    color: rgba(0, 130, 65, 1);
    opacity: 1;
  }
  ::v-deep .el-tabs__item:hover {
    color: rgba(0,130,65,1);
    opacity: 1;
  }
}

.header {
  display: flex; 
  justify-content: center; 
  align-items: center; 
  flex-direction: column; 
  height: 140px; 
}

.avatar-container {
  width: 100px;
  height: 100px;
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

.avatar-container img {
  max-width: 100%; /* 限制最大宽度 */
  max-height: 100%; /* 限制最大高度 */
  object-fit: cover; /* 确保图片填满容器 */
  object-position: center; /* 确保图片居中显示 */
}


.user-info {
  text-align: left;
  margin: 20px 0;
  font-size: 16px;
}

.user-info-item {
  margin: 10px 0;
}

.edit-container {
  margin-top: 40px;
  text-align: center;
}
.sysu-style{
  background-color: rgba(0,130,65,1);
  color: white;
}
.sysu-style:hover{
  background-color: rgba(0,130,65,0.7);
}

.button-space {
  width: 100%;
}

.work-container {
  max-height: 700px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-con{
  ::v-deep .el-pagination .el-pager li.is-active, .el-pager li:hover {
    color: rgba(0, 130, 65, 1);
  }
  ::v-deep .el-pager li:hover{
    color: rgba(0, 130, 65, 1);
  }
}

.posts-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.single-post{
  margin-top: 5px;
  width: 50%;
  height: 270px;
  width: 350px;
}

:deep(.post-card .post-info .post-title){
  margin: 2% 0 3px;
}

.el-col {
  width: calc(50% - 10px); /* 每个卡片占 50% 宽度，减去间隔 */
}

.el-card {
  height: 100%; /* 确保每个卡片的高度一致 */
  display: flex;
  flex-direction: column;
}

.el-card img {
  width: 100%; /* 确保图片填满卡片 */
  height: 100%;
  object-fit: cover;
}
.pagination{
  margin-top: 20px;
}
.el-pagination .is-active {
    color: rgba(0, 130, 65, 1); /* 活动页码的颜色 */
}
</style>
