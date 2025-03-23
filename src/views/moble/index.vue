<template>
    <div class="container">
      <header class="header">高新区团系统工作平台</header>
  
      <div class="search-bar">
        <input type="text" placeholder="在当前分区搜索" v-model="searchQuery" />
        <button @click="search">搜索</button>
      </div>
  
      <div class="post-list">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </div>
  
      <!-- 直接使用 FooterNav，不用传参数 -->
      <FooterNav />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import PostItem from "@/components/moble/postCard.vue"; 
  import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
  
  const searchQuery = ref("");
  const posts = ref([
    { id: 1, title: "标题1", summary: "正文缩略1", image: "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg" },
    { id: 2, title: "标题2", summary: "正文缩略2", image: "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg" },
    { id: 3, title: "标题3", summary: "正文缩略3", image: "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg" },
  ]);
  
  const search = () => {
    console.log("搜索内容:", searchQuery.value);
  };
  </script>
  
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
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
    position: relative;
    z-index: 10;
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
  
  .post-list {
    width: 90%;
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-around;
    background: rgba(0, 130, 65, 1);
    padding: 10px 0;
    position: fixed;
    bottom: 0;
  }
  
  .footer div {
    color: white;
    font-size: 14px;
    cursor: pointer;
  }
  </style>
  