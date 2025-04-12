<template>
  <div class="container">
    <!-- 顶部导航栏（包含发布者信息） -->
    <header class="header">
      <el-icon @click="goBack" class="back-icon"><arrow-left /></el-icon>
      <div class="author-info">
        <img class="author-avatar" :src="author.avatar" alt="author-avatar" @click="navigateToProfile"/>
        <div class="author-details">
          <div class="author-name">{{ author.username || '未知用户' }}</div>
        </div>
      </div>
      <!-- 创建时间放置在按钮上方 -->
      <div class="post-actions">
        <el-button v-if="isCurrentUser"  type="success" @click="EditPost">修改帖子</el-button>
        <el-button v-if="isCurrentUser"  type="danger" @click="DelPost">删除帖子</el-button>
      </div>
    </header>

    <!-- 帖子标题 -->
    <div class="title-container">
      <div class="article-created-at">创建于：{{ formattedCreateAt }}</div>
      <h1 class="title">{{ article.title }}</h1>
    </div>

    <!-- 内容区（包含多媒体和文章） -->
    <div class="content-container">
      <div class="media-section">
        <img v-if="article.type==0" :src="article.cover" alt="cover" class="cover-image" />
        <video v-else controls :src="article.video" class="video-player"></video>
      </div>
      <div class="article-content" v-html="article.content"></div>
    </div>

    <!-- 底部导航 -->
    <div class="footer" v-if="check">
      <el-button type="danger" plain @click="deletePost" v-if="isDeletePage">删除</el-button>
      <el-button type="danger" plain @click="approvePost(2)" v-if="ischeck">不批准</el-button>
      <el-button type="success" @click="approvePost(1)" v-if="ischeck">批准</el-button>
    </div>
<!--    <footer class="footer-nav">-->
<!--      <el-button class="nav-btn" @click="router.push('/mob/index')">返回首页</el-button>-->
<!--      <el-button class="nav-btn" @click="toModifyPost">发布帖子</el-button>-->
<!--      <el-button class="nav-btn" @click="navigateToProfile">个人主页</el-button>-->
<!--    </footer>-->
    <div class="footer-nav-wrapper">
      <FooterNav/>
    </div>
  </div>
</template>

<style scoped>
/* 主容器 */
.container {
  width: 100%;
  max-width: 640px;
  min-width: 430px;
  margin: 0 auto;
  background: #f5f5f5;
  padding-top: 6rem; /* rem 替代 px */
  padding-bottom: 6rem; /* 预留底部导航空间 */
  box-sizing: border-box;
}

/* 为 FooterNav 添加外层容器 */
.footer-nav-wrapper {
  margin-top: 20px;
}

/* 调整 footer 内部间距 */
.footer-nav-wrapper :deep(.footer) {
  gap: 20px;
  padding: 10px 10px;
  justify-content: space-around;
}

/* 顶部导航栏（包含发布者信息） */
.header {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%); /* 居中 */
  width: 100%;
  max-width: 640px;
  min-width: 430px;
  background: rgba(0, 130, 65, 1);
  color: white;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.back-icon {
  font-size: 1.8rem;
  cursor: pointer;
}

.author-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  background: white;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 1.9rem;
  font-weight: bold;
}

.article-created-at {
  position: absolute; /* 绝对定位 */
  top: 1rem; /* 距离父容器顶部 1rem（与父容器的 padding 对齐） */
  right: 1rem; /* 距离父容器右侧 1rem */
  font-size: 1rem;
  font-size: 12px;
  opacity: 0.8;
}

/* 帖子标题样式 */
.title-container {
  position: relative;
  align-items: center; /* 垂直居中 */
  background: white;
  margin: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  margin-top: 1.3rem;
}

/* 文章 & 多媒体区域 */
.content-container {
  background: white;
  margin: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0.1875rem 0.625rem rgba(0, 0, 0, 0.15);
}


/* 多媒体区域 */
.media-section {
  display: flex;
  grid-template-columns: 1fr;
  justify-items: center;
}

.video-player, .cover-image {
  width: 100%;
  border-radius: 1rem;
  object-fit: cover;
}


/* 文章内容 */
.article-content {
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 0.67rem;
  word-break: break-all; /* 强制所有字符换行（包括长单词/字符） */
  overflow-wrap: break-word; /* 优先在单词内换行 */
  white-space: pre-wrap; /* 保留空格和换行符 */
}

/* 底部导航 */
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); /* 居中 */
  width: 100%;
  max-width: 640px;
  min-width:320px;
  background: rgba(0, 130, 65, 1);
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  box-sizing: border-box;
}

.nav-btn {
  flex: 1;  /* 使按钮占据可用空间 */
  margin: 0 0.5rem;  /* 左右间距 */
  background: transparent;
  color: white;
  border: 0.0625rem solid rgba(0, 130, 65, 1);
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: background-color 0.3s, color 0.3s; /* 平滑过渡 */
  width: 100%;
  text-align: center;  /* 使文字居中 */
}

/* 悬停效果 */
.nav-btn:hover {
  background-color: rgba(0, 130, 65, 1);  /* 按钮悬停时背景色 */
  color: white;  /* 悬停时文字颜色 */
  cursor: pointer;  /* 悬停时显示手指光标 */
  transform: scale(1.2);  /* 按钮悬停时轻微放大 */
}
/*check 按钮*/
.footer {
  display: flex; /* 使用 Flexbox */
  justify-content: center; /* 水平居中内容 */
  align-items: center; /* 垂直居中内容 */
  padding-top: 10px;
}
@media (min-width: 641px) {
  .container {
    padding-top: 5rem; /* 增加顶部空间 */
    padding-bottom: 7rem; /* 增加底部空间 */
  }

  .header {
    padding: 1.5rem; /* 更大的内边距 */
  }

  .title {
    font-size: 2rem; /* 增加标题字体 */
  }

  .article-content {
    font-size: 1.2rem; /* 增加文章内容字体 */
  }

  .footer-nav {
    padding: 1.5rem; /* 增加底部导航内边距 */
  }
}

/* 针对屏幕宽度小于 640px 时 */
@media (max-width: 640px) {
  .container {
    padding-top: 3rem; /* 减小顶部空间 */
    padding-bottom: 5rem; /* 减小底部空间 */
  }

  .header {
    padding: 0.8rem; /* 减小内边距 */
  }

  .title {
    font-size: 1.3rem; /* 调整标题字体 */
  }

  .article-content {
    font-size: 0.9rem; /* 调整文章内容字体 */
  }

  .footer-nav {
    padding: 0.8rem; /* 减小底部导航内边距 */
  }

  .nav-btn {
    font-size: 0.9rem; /* 减小按钮字体 */
    padding: 0.6rem; /* 减小按钮内边距 */
  }
}

/* 针对屏幕宽度小于 480px 时 */
@media (max-width: 480px) {
  .header {
    padding: 0.6rem; /* 更小的内边距 */
  }

  .title {
    font-size: 1.1rem; /* 更小的标题字体 */
  }

  .article-content {
    font-size: 0.85rem; /* 更小的文章内容字体 */
  }

  .footer-nav {
    padding: 0.6rem; /* 更小的底部导航内边距 */
  }

  .nav-btn {
    font-size: 0.8rem; /* 更小的按钮字体 */
    padding: 0.5rem; /* 更小的按钮内边距 */
  }
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import {getPostDetailAPI, delSelfPostAPI, deletePostAPI, approvePostAPI} from '@/api/post';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import FooterNav from "@/views/moble/footer.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const token = authStore.token;
const article = ref({ id: '', title: '', content: '', video: '', cover: '', createAt: '' });
const author = ref({ avatar: '', username: '', id: 0 });
const currentUser = computed(() => authStore.userInfo);
const isCurrentUser = computed(() => currentUser.value?.id === author.value.id);
const curTab = route.query.curTab || 0

const check = route.query.check;
const source = route.query.source;
const isDeletePage = source === 'delete';
const ischeck = source === 'check';

const fetchPostData = async () => {
  const postID = route.query.postID;
  console.log('fetchPostData->postID:', postID);
  if (!postID) return;
  try {
    const response = await getPostDetailAPI({ postID ,token});
    console.log('fetchPostData->response:', response);
    if (response.data?.post) {
      article.value = {
        ...response.data.post,
        createAt: response.data.post.created_at // 修正字段
      };
      author.value = { ...response.data.post.user };
      console.log('fetchPostData->author:', author.value);
    }
  } catch (error) {
    console.error('Failed to fetch post data:', error);
  }
};

const navigateToProfile = () => router.push({ path: '/mob/my-home-page', query: { id: author.value.id } });
const toModifyPost = () => {
  router.push({
    // name: article.value.video ? 'edit-video-post' : 'edit-txt-img-post',
    path: `/mob/${article.value.video ? 'videoPost' : 'txtimgPost'}`,
    query: {
      postID: article.value.id,
      source: 'detail',
      curTab: curTab
    }
  });
};
const EditPost = () => {
  router.push({
    name: article.value.video ? 'mobEditVideoPost' : 'mobEditTxtimgPost',
    query: {
      postID: article.value.id,
      source: 'detail'
    }
  });
};
async function DelPost(){
  const postID = article.value.id; // 获取当前帖子的 ID
  if(!postID){
    ElMessage.error('帖子ID不存在')
  }
  const res = await delSelfPostAPI(postID)
  if(res.code === 0){
    ElMessage.success(res.msg)
    router.push('/mob/index')
  }else{
    ElMessage.warning(res.msg)
  }
}
async function deletePost() {   //删除贴子
  const postID = article.value.id; // 获取当前帖子的 ID
  if (!postID) {
    ElMessage({
      message: "帖子 ID 不存在",
      type: 'error',
    });
    return;
  }

  try {
    // 调用删除帖子接口
    const response = await deletePostAPI(postID);

    if (response.code === 0) {
      // 删除成功后显示成功信息
      ElMessage({
        message: response.msg || '删除成功',
        type: 'success',
      });
      // 删除成功后跳转到删除帖子页面
      router.push('/manage/post-modify');
    } else {
      // 删除失败时显示错误信息
      ElMessage({
        message: response.msg || '删除失败',
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    // 连接错误时显示提示
    ElMessage({
      message: "无法连接服务器",
      type: 'error',
    });
  }
}
async function approvePost(ifApprove) {
  const data = {
    postID: article.value.id,
    action: ifApprove,
  };
  try {
    console.log(data);
    const response = await approvePostAPI(data);
    console.log(response);
    if (response.code === 0) {
      await router.push('/mob/manage/post-check');
      ElMessage({
        message: '审批成功',
        type: 'success'
      });
    } else {
      ElMessage({
        message: response.msg || '审批失败',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    ElMessage({
      message: "无法连接服务器",
      type: 'error',
    });
  }
}
const goBack = () => router.back();
const formattedCreateAt = computed(() => article.value.createAt ? new Date(article.value.createAt).toLocaleDateString() : '');

onMounted(fetchPostData);
</script>
