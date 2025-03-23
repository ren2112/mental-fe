<template>
    <nav class="footer">
      <div v-for="item in navItems" :key="item.path" @click="navigateTo(item.path)">
        <span>{{ item.name }}</span>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  // 固定的导航项
  const navItems = [
    { name: "分区选择", path: "/categories" },
    { name: "发布帖子", path: "/post" },
    { name: "个人主页", path: "/profile" },
  ];
  
  const navigateTo = (path) => {
    router.push(path);
  };
  </script>
  
  <style scoped>
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
  