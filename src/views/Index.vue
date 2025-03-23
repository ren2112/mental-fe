<template>
  <div class="Index">
    <div class="sidebar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          style="max-width: 550px"
          placeholder="在当前分区搜索"
          class="input-with-select"
        >
        </el-input>
        <el-button :icon="Search" @click="handleSearch" class="search-buttom"/>
      </div>
      <div class="filter-box">
        <div class="filter-title">文章分区 :</div>
        <div class="filter-options">
          <el-button
            v-for="(label, index) in filterOptions"
            :key="index"
            :type="currentPart === index  ? 'primary' : 'default'"
            :class="{'active-button': currentPart === index}"
            round
            @click="handlePartChange(index)"
          >
            {{ label }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="content" v-if="posts.length>0">
      <div class="post-grid">
        <!-- 使用 PostCard 组件展示每个帖子 -->
        <PostCard v-for="post in posts" :key="post.id" :post="post" style="height: 345px;" />
      </div>

      <!-- 分页组件 -->
      <div class="page-choose">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalPosts"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    <div class="empty-post" v-else>
      <div class="empty-component">
        <el-icon :size="100" color="rgba(0, 130, 100, 1)"><DocumentDelete /></el-icon> 
        <p>这里空空如也...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import PostCard from '@/components/PostCard.vue';
import { getPostsByPartAPI } from '@/api/post';

const searchQuery = ref('');
const posts = ref([]);
const currentPage = ref(1);
const pageSize = ref(4);
const totalPosts = ref(0);
const currentPart = ref(0);

const filterOptions = [
  "理论学习",
  "走进高新",
  "青年活动",
  "青年夜校",
  "志愿服务",
  "社会实践",
];

// 获取帖子数据的函数
const fetchPosts = async () => {
  try {
    const response = await getPostsByPartAPI(currentPart.value, currentPage.value, pageSize.value, searchQuery.value);
    if (response.code === 0) {
      posts.value = response.data.posts;
      totalPosts.value = response.data.total;
    }
  } catch (error) {
    console.error("获取帖子数据失败:", error);
  }
};

// 搜索触发函数
const handleSearch = async () => {
  currentPage.value = 1;  // 重置页码为1
  await fetchPosts();     // 重新请求数据
};

// 分区更改处理函数
const handlePartChange = (part: number) => {
  currentPart.value = part;
  currentPage.value = 1;  // 切换分区时重置页码
  searchQuery.value = ''; // 清空搜索内容
  fetchPosts();           // 重新获取帖子
};

// 页码更改处理函数
const handlePageChange = async(page: number) => {
  currentPage.value = page;
  await fetchPosts();  // 更新当前页数并重新请求数据
};

// 页面加载时获取数据
onMounted(async () => {
  await fetchPosts();
});
</script>

<style scoped lang="scss">

.page-choose{
  ::v-deep .el-pagination .el-pager li.is-active, .el-pager li:hover {
    color: rgba(0, 130, 65, 1);
  }
  ::v-deep .el-pager li:hover{
    color: rgba(0, 130, 65, 1);
  }
}

.Index {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 268px;
  height: 768px;
  flex-shrink: 0;
  position: sticky;
  display: flex;
  flex-direction: column; /* 改为垂直排列 */
  margin-top: 10px;
}

/* 修改输入框的样式 */
.search-box {
  margin-bottom: 7px;
  position: relative;

  /* 修改搜索框样式 */
  ::v-deep .el-input__wrapper {
    border-radius: 30px; /* 圆角 */
    border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
    // color: rgba(0, 130, 65, 1); /* 输入框内文本颜色 */
    transition: border-color 0.3s, background-color 0.3s;
  }
  ::v-deep .el-input__wrapper.is-focus {
    border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
    box-shadow: none;
  }

  /* 输入框获取焦点时的样式 */
  ::v-deep .el-input__inner:focus {
    border-color: rgba(0, 130, 65, 1); /* 焦点时边框颜色 */
    // background-color: rgba(0, 130, 65, 0.1); /* 背景色 */
  }

  /* 输入框的悬停样式 */
  // ::v-deep .el-input__inner:hover {
  //   // border-color: rgba(0, 130, 65, 1); /* 悬停时的边框颜色 */
  //   // background-color: rgba(0, 130, 65, 0.1); /* 悬停时的背景色 */
  // }
}

/* 修改按钮的样式 */
.search-buttom {
  position: absolute;
  right: 0;
  top: 1px;
  border-radius: 30px;
  background-color: rgba(0, 130, 65, 1); /* 默认按钮背景色 */
  color: white;
  border: none;
  transition: background-color 0.3s, box-shadow 0.3s;
  padding: 6px 16px;
  
  &:hover {
    background-color: rgba(0, 130, 65, 0.8); /* 悬停时按钮背景色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
  }

  &:focus {
    background-color: rgba(0, 130, 65, 1); /* 按钮聚焦时的背景色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 聚焦时的阴影 */
  }

  .el-icon {
    font-size: 20px;
    color: white;
  }
}

/* 按钮的点击样式 */
.search-buttom:active {
  background-color: rgba(0, 130, 65, 1); /* 点击时按钮背景色 */
  box-shadow: none;
}


.filter-box {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  flex:1;
  margin-top: 10px;
  
  .filter-title {
    font-weight: 600;
    margin-bottom: 15px;
    margin-left: 10px;
    color: rgba(0,130,65,1); 
  }
  
  .filter-options {
  display: grid; /* 网格布局 */
  grid-template-columns: repeat(2, 1fr); /* 每行两列 */
  gap: 10px; /* 按钮间距 */
  .el-button {
    width: 100%; /* 按钮宽度占满列 */
    text-align: center;
    font-weight: bold;
    border: 1px solid rgba(0,130,65,0.3);
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    &:hover {
      color: rgba(0,130,65,1);
      background-color: rgba(0,130,65,0.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 鼠标悬停阴影加深 */
    }
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .active-button {
      background-color: rgba(0, 130, 65, 1); 
      color: white; 
      border-color: rgba(0, 130, 65, 1); 
  }
}
}
.content {
  flex: 1;
  min-width: 0;
  height: 100%;
}

.empty-post{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 12px;
  min-width: 800px;
  height: 750px;
  background-color: white;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding:10px;

}
.empty-component{
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  align-items: center;
}
</style>
