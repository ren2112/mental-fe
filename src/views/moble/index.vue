<template>
  <div class="container">
    <header class="header">高新区团系统工作平台</header>

    <div class="search-bar">
      <input type="text" placeholder="在当前分区搜索" v-model="searchQuery" />
      <button @click="handleSearch">搜索</button>
    </div>

    <!-- 固定高度可滚动的帖子区域 -->
    <div class="post-list" ref="postContainer">
      <PostItem v-for="post in posts" :key="post.id" :post="post" v-if="posts.length>0"/>
      <div class="empty-post" v-else>
        <div class="empty-component">
          <el-icon :size="100" color="rgba(0, 130, 100, 1)"><DocumentDelete /></el-icon> 
          <p>这里空空如也...</p>
        </div>
      </div>
    </div>

    <FooterNav @part-selected="handlePartChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import PostItem from "@/components/moble/postCard.vue";
import FooterNav from "@/views/moble/footer.vue";
import { getPostsByPartAPI } from "@/api/post";
import { throttle } from "lodash";

const searchQuery = ref("");
const posts = ref([]);
const currentPart = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);
const postContainer = ref(null); // 引用帖子列表 DOM

// 获取帖子数据
const fetchPosts = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const response = await getPostsByPartAPI(currentPart.value, currentPage.value, 5, searchQuery.value);
    if (response.code === 0) {
      posts.value = currentPage.value === 1 ? response.data.posts : [...posts.value, ...response.data.posts];
      currentPage.value++;
    }
  } catch (error) {
    console.error("获取帖子数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 触发搜索
const handleSearch = async () => {
  currentPage.value = 1;
  posts.value = [];
  await fetchPosts();
};

const handleScroll = () => {
  const bottomOffset = 100; // 距离底部多少时加载更多
  const el = postContainer.value;

  if (el && el.scrollHeight - el.scrollTop - el.clientHeight < bottomOffset) {
    fetchPosts();
  }
};



// 使用 throttle 包装 handleScroll，避免频繁触发
const throttledScroll = throttle(handleScroll, 300); // 每300ms触发一次

const handlePartChange = (partIndex) => {
  currentPart.value = partIndex;
  currentPage.value = 1;
  posts.value = [];
  fetchPosts();
};

onMounted(() => {
  fetchPosts();
  if (postContainer.value) {
    postContainer.value.addEventListener("scroll", throttledScroll);
  }
});

onUnmounted(() => {
  if (postContainer.value) {
    postContainer.value.removeEventListener("scroll", throttledScroll);
  }
});

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
  height: 100vh; /* 使用视口高度适配 */
  overflow: hidden; /* 防止页面整体滚动 */
}

.header {
  width: 100%;
  height: 10vh; /* 10% 视口高度 */
  background: rgba(0, 130, 65, 1);
  color: white;
  text-align: center;
  padding-top: 2vh;
  font-size: 2.2vh;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  position: fixed;
  top: 0;
  top: 0;
  z-index: 100;
}

.search-bar {
  display: flex;
  width: 85%;
  background: white;
  border-radius: 20px;
  padding: 1.5vh 1vh;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 10vh; /* 紧贴 header 底部 */
  z-index: 100;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.6vh;
  padding: 1vh;
}

.search-bar button {
  background: rgba(0, 130, 65, 1);
  color: white;
  border: none;
  padding: 0.8vh 1.2vh;
  border-radius: 1vh;
  cursor: pointer;
  font-size: 1.6vh;
}

/* 帖子列表 */
.post-list {
  width: 90%;
  background: white;
  border-radius: 2vh;
  padding: 1vh;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  position: absolute;
  top: calc(10vh + 8vh); /* header + search-bar */
  bottom: 5vh; /* 留出 footer 导航区域 */
  overflow-y: auto;
}

.empty-post {
  text-align: center;
}

.empty-component p {
  margin-top: 1vh;
  font-size: 2vh;
  color: #666;
}

</style>
