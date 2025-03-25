<template>
  <nav class="footer">
    <div v-for="item in dynamicNavItems" :key="item.path" @click="navigateTo(item.path)">
      <span>{{ item.name }}</span>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

// 基础导航项配置
const baseNavItems = [
  { name: "发布帖子", path: "/mob/videoPost" },
  { name: "个人主页", path: "/mob/my-home-page" },
];

// 动态计算导航项
const dynamicNavItems = computed(() => {
  const isHomePage = route.path === "/mob/index";
  const firstItem = isHomePage 
    ? { name: "分区选择", path: "/categories" }
    : { name: "返回首页", path: "/mob/index" };

  return [firstItem, ...baseNavItems];
});

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
  