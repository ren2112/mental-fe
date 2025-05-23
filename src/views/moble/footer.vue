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
import { useAuthStore } from "@/stores/auth"; // 引入 Pinia 的 useAuthStore

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // 获取用户信息

const baseNavItems = [
  { name: "发布帖子", path: "/mob/videoPost" },
  { name: "个人主页", path: "/mob/my-home-page" },
];

const navOptions = ["理论学习", "走进高新", "青年活动", "青年夜校", "志愿服务", "社会实践"];
const selectedPart = ref("分区选择");

// 新增登录状态判断
const shouldShowAuthItems = computed(() => {
  return authStore.token // 仅登录用户显示需要认证的项
})

const dynamicNavItems = computed(() => {
  const isHomePage = route.path === "/mob/index";
  const firstItem = { name: "返回首页", path: "/mob/index" };
  return isHomePage ? baseNavItems : [firstItem, ...baseNavItems];
});

const isHomePage = computed(() => route.path === "/mob/index");

// **修改 navigateTo 以传递用户 ID**
const navigateTo = (path) => {
  if (path === "/mob/my-home-page" && shouldShowAuthItems.value) {
    console.log(authStore.userInfo.id);
    if (!authStore.token) {
      router.push('/mob/login')
      return
    }
    // 安全访问用户信息
    const userId = authStore.userInfo?.id ?? ''
    router.push({ 
      path, 
      query: { id: userId }
    })  //传递用户id
  } else {
    router.push(path);
  }
};

// **修改 handlePartSelect 以触发事件**

const emit = defineEmits(["part-selected"]); // 定义事件

const handlePartSelect = (index) => {
  selectedPart.value = navOptions[index];
  emit("part-selected", index); // 触发事件，将 index 传递给父组件
};
</script>


<style scoped>
.footer {
  min-width: 400px;
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
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
