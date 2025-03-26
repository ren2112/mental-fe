<template>
  <nav class="footer">
    <!-- 使用 el-dropdown 来展示分区选择 -->
    <el-dropdown v-if="isHomePage" @command="handlePartSelect">
      <div class="dropdown-trigger">
        <span>{{ selectedPart }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(label, index) in navOptions" :key="index" :command="index">
            {{ label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 其他固定导航项 -->
    <div v-for="item in dynamicNavItems" :key="item.path" @click="navigateTo(item.path)">
      <span>{{ item.name }}</span>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";

// 初始化路由
const router = useRouter();
const route = useRoute();

// 基础导航项配置
const baseNavItems = [
  { name: "发布帖子", path: "/mob/videoPost" },
  { name: "个人主页", path: "/mob/my-home-page" },
];

// 分区选项
const navOptions = [
  "理论学习",
  "走进高新",
  "青年活动",
  "青年夜校",
  "志愿服务",
  "社会实践",
];

// 选中的分区
const selectedPart = ref("分区选择");

// 动态计算导航项
const dynamicNavItems = computed(() => {
  const isHomePage = route.path === "/mob/index";
  const firstItem = { name: "返回首页", path: "/mob/index" };
  if(!isHomePage){
    return [firstItem, ...baseNavItems];
  }else{
    return baseNavItems;
  }

});

// 判断是否是首页
const isHomePage = computed(() => route.path === "/mob/index");

// 导航跳转函数
const navigateTo = (path) => {
  if (path !== "#") {
    router.push(path);
  }
};

// 处理分区选择
const handlePartSelect = (index) => {
  selectedPart.value = navOptions[index]; // 更新选中的分区
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

.dropdown-trigger {
  color: white;
  font-size: 14px;
  cursor: pointer;
}
</style>
