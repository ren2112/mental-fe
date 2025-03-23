<template>
    <div class="post-card">
      <RouterLink :to="{ name: 'content', query: { postID: post.id , check: 2 , ...(curTab ? { curTab } : {})} }" class="post-link">
        <!-- <div class="post-media" v-if="post.type === 1">
          <div class="video-placeholder">
            <video v-if="post.video" :src="post.video" controls></video>
          </div>
        </div> -->
        <div class="post-media">
          <div class="image-placeholder" v-if="post.cover">
            <img 
              v-if="post.cover" 
              :src="post.cover.startsWith('http://localhost:8082/public/') 
                ? post.cover 
                : `http://localhost:8082/public/${post.cover}`" 
              alt="Post Image" 
            />
          </div>
        </div>

        <div class="post-info">
          <h3 class="post-title">{{ truncatedTitle }}</h3>
          <p class="post-content">{{ truncatedContent }}</p>
        </div>
      </RouterLink>
    </div>
</template>
  
<script setup lang="ts">
  import { defineProps ,computed} from 'vue';
  
  // 定义接收的属性
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
    curTab: {
      type: Number,
      required: false, // 设置为非必须
    }
  });
    // 计算属性：限制标题长度
    const truncatedTitle = computed(() => {
    if (!props.post.title) return '';
    return props.post.title.length > 18
        ? props.post.title.slice(0, 18) + ' ...'
        : props.post.title;
    });

    // 工具函数：移除HTML标签并转义字符
    const stripHtmlAndDecode = (html:any) => {
    // 创建临时的 DOM 元素来解析 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html; // 设置内容为HTML
    const text = tempDiv.textContent || tempDiv.innerText || ''; // 提取纯文本
    return text;
    };

    // 计算属性：限制内容长度，忽略HTML标签
    const truncatedContent = computed(() => {
    if (!props.post.content) return '';
    const plainText = stripHtmlAndDecode(props.post.content); // 转义字符解析
    return plainText.length > 65
        ? plainText.slice(0, 65) + '...'
        : plainText;
    });
</script>
  
  <style scoped lang="scss">
   .post-link {
  text-decoration: none;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  .post-media {
    height: 70%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 图片和视频展示统一样式 */
  .post-media img,
  .post-media video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .post-media .image-placeholder,
  .post-media .video-placeholder {
    height: 100%;
    width: 100%;
  }

  .post-info {
    padding: 2%;

    .post-title {
      margin: 3% 0 8px;
      color: rgba(0,130,65,1);
      font-size: 16px;
      font-weight: 468;
    }

    .post-content {
      margin: 0 0 12px;
      color: #666;
      font-size: 14px;
    }

    .post-meta {
      font-size: 12px;
      color: #999;
    }
  }
}
  </style>
  