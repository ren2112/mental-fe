<template>
    <div class="post-item">
      <div class="post-content">
        <h3>{{ post.title }}</h3>
        <p>{{ post.summary }}</p>
      </div>
      <img class="post-image" :src="post.image" alt="帖子图片" />
    </div>
  </template>
  
  <script setup>
  defineProps({
    post: Object
  });
  </script>
  
  <style scoped>
  .post-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  
  .post-content h3 {
    margin: 0;
    font-size: 16px;
  }
  
  .post-content p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #666;
  }
  
  .post-image {
    width: 100px; /* 适当调整宽度 */
    height: 70px; /* 适当调整高度 */
    border-radius: 8px;
    object-fit: cover;
  }
  </style>
  