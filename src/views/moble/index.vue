<template>
  <div class="container">
    <header class="header">高新区团系统工作平台</header>

    <div class="search-bar">
      <input type="text" placeholder="在当前分区搜索" v-model="searchQuery" />
      <button @click="handleSearch">搜索</button>
    </div>
    <!-- 单列瀑布流布局 -->
    <div class="post-list" ref="postContainer">
      <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <FooterNav @part-selected="handlePartChange" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import PostItem from "@/components/moble/postCard.vue";
import FooterNav from "@/views/moble/footer.vue";
import { getPostsByPartAPI } from "@/api/post";
import { throttle } from "lodash";  // 导入 lodash 的 throttle 方法

const searchQuery = ref("");
const posts = ref([]);
const currentPart = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);

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

// 监听滚动事件（加载更多帖子）
const handleScroll = () => {
  const bottomOffset = 150; // 距离底部150px时加载更多帖子
  const container = document.documentElement;

  if (container.scrollHeight - (window.innerHeight + container.scrollTop) < bottomOffset) {
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
  window.addEventListener("scroll", throttledScroll); // 使用节流后的滚动事件
});

onUnmounted(() => {
  window.removeEventListener("scroll", throttledScroll);
});
</script>

<style scoped>
.container {
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
  min-height: 100vh; /* 确保容器至少占满整个视口的高度 */
}

.header {
  width: 100%;
  height: 80px;
  background: rgba(0, 130, 65, 1);
  color: white;
  text-align: center;
  padding-top: 20px;
  font-size: 18px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  position: fixed;
  z-index: 100;
}

.search-bar {
  display: flex;
  width: 85%;
  background: white;
  border-radius: 20px;
  padding: 10px;
  margin-top: -20px;
  margin-bottom: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 80px;
  z-index: 100;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 6px;
  font-size: 14px;
}

.search-bar button {
  background: rgba(0, 130, 65, 1);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* 单列布局 */
.post-list {
  width: 90%;
  background: white;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 125px; /* 使帖子列表下移，避免与固定搜索框重叠 */
  overflow-y: auto;  /* 添加滚动条 */
}
</style>
