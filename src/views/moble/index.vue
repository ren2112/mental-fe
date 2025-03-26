<template>
  <div class="container">
    <header class="header">高新区团系统工作平台</header>

    <div class="search-bar">
      <input type="text" placeholder="在当前分区搜索" v-model="searchQuery" />
      <button @click="handleSearch">搜索</button>
    </div>

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

const searchQuery = ref("");
const posts = ref([]);
const currentPart = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);


const fetchPosts = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const response = await getPostsByPartAPI(currentPart.value, currentPage.value, 5, searchQuery.value);
    if (response.code === 0) {
      if (currentPage.value === 1) {
        posts.value = response.data.posts; // **如果是第一页，直接替换**
      } else {
        posts.value = [...posts.value, ...response.data.posts]; // **否则追加**
      }
      currentPage.value++; // **请求成功后，增加 pagenum**
    }
  } catch (error) {
    console.error("获取帖子数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};


const handleSearch = async () => {
  currentPage.value = 1;
  posts.value = [];
  await fetchPosts();
};

// 处理 FooterNav 选择分区
const handlePartChange = (partIndex) => {
  currentPart.value = partIndex; // 更新当前分区
  currentPage.value = 1; // **重置分页**
  posts.value = []; // **清空当前帖子**
  fetchPosts(); // **重新获取帖子**
};

const handleScroll = () => {
  const bottomOffset = 100;
  const container = document.documentElement;
  if (container.scrollHeight - (window.innerHeight + container.scrollTop) < bottomOffset) {
    fetchPosts();
  }
};

onMounted(() => {
  fetchPosts();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
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

.filter-box {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  width: 90%;
  margin-bottom: 10px;
}

.filter-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: rgba(0, 130, 65, 1);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-options button {
  border: 1px solid rgba(0, 130, 65, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
}

.active-button {
  background-color: rgba(0, 130, 65, 1);
  color: white;
}

.post-list {
  width: 90%;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}
</style>
