<template>
  <div class="post-item">
    <RouterLink
      :to="{ name:'mob-content', query: { postID: post.id, check: 2, ...(curTab ? { curTab } : {}) } }"
      class="post-link"
    >
      <!-- 帖子封面 -->
      <div class="post-media">
        <div class="image-placeholder" v-if="post.cover">
          <img :src="post.cover" alt="帖子封面" class="post-image" />
        </div>
      </div>
      <!-- 帖子内容 -->
      <div class="post-content">
        <h3 class="post-title">{{ truncatedTitle }}</h3>
        <p class="post-summary">{{ truncatedContent }}</p>
      </div>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 定义接收的属性
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  curTab: {
    type: Number,
    required: false,
  },
});

// 计算属性：限制标题长度
const truncatedTitle = computed(() => {
  if (!props.post.title) return "";
  return props.post.title.length > 18
    ? props.post.title.slice(0, 18) + " ..."
    : props.post.title;
});

// 工具函数：移除 HTML 标签并转义字符
const stripHtmlAndDecode = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// 计算属性：限制内容长度，忽略 HTML 标签
const truncatedContent = computed(() => {
  if (!props.post.content) return "";
  const plainText = stripHtmlAndDecode(props.post.content);
  return plainText.length > 15 ? plainText.slice(0, 15) + "..." : plainText;
});
</script>

<style scoped>
/* 保持原样，控制帖子外观 */
.post-link {
  text-decoration: none;
  display: flex;
  flex-direction: row-reverse; /* 让图片在右边 */
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 2px solid #eee;
  transition: all 0.3s ease; /* 增加平滑过渡效果 */
  margin-bottom: 5px;
}

/* 鼠标悬停时的效果 */
.post-link:hover {
  background-color: #f7f7f7; /* 背景色稍微变浅 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 增加阴影 */
  transform: scale(1.02); /* 略微放大 */
}

/* 内容区域样式 */
.post-content {
  flex: 1;
  margin-right: 10px;
}

.post-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: black;
}

.post-summary {
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}

/* 封面图样式 */
.post-media {
  flex-shrink: 0;
}

.post-image {
  width: 150px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
