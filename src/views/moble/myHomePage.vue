<template>
    <div class="container">
      <div class="user-info">
        <div class="avatar"></div>
        <div class="info">
          <div class="name">姓名</div>
          <div class="email">邮箱</div>
          <div class="department">部门</div>
        </div>
      </div>
  
      <div class="actions">
        <button>编辑资料</button>
        <button>管理系统</button>
        <button>退出登录</button>
      </div>
  
      <div class="post-tabs">
        <button :class="{ active: currentTab === 'published' }" @click="currentTab = 'published'">已发布</button>
        <button :class="{ active: currentTab === 'pending' }" @click="currentTab = 'pending'">审核中</button>
        <button :class="{ active: currentTab === 'rejected' }" @click="currentTab = 'rejected'">未通过</button>
        <button :class="{ active: currentTab === 'trash' }" @click="currentTab = 'trash'">回收站</button>
      </div>
  
      <div class="post-list">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </div>
  
      <FooterNav />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import PostItem from "@/components/moble/postCard.vue";
  import FooterNav from "@/views/moble/footer.vue";
  
  const posts = ref([
    { id: 1, title: "标题1", summary: "正文缩略1", image: "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg" },
    { id: 2, title: "标题2", summary: "正文缩略2", image: "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg" },
    { id: 3, title: "标题3", summary: "正文缩略3", image: "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg" },
  ]);
  
  const currentTab = ref("published");
  
  const filteredPosts = computed(() => {
    return posts.value.filter((post) => post.status === currentTab.value);
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f8f8f8;
  }
  
  .user-info {
    display: flex;
    background: rgba(0, 130, 65, 1);
    padding: 20px;
    color: white;
  }
  
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: white;
    margin-right: 20px;
  }
  
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .actions {
    display: flex;
    justify-content: space-around;
    padding: 10px;
  }
  
  .actions button {
    background: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .post-tabs {
    display: flex;
    justify-content: space-around;
    padding: 10px;
  }
  
  .post-tabs button {
    background: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .post-tabs button.active {
    background: rgba(0, 130, 65, 1);
    color: white;
  }
  
  .post-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  </style>