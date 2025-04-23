<template>
  <div class="manage-page">
    <!--  head  -->
    <el-header class="header">
      <el-dropdown split-button type="primary" @click="backToUserManage(department)">
        {{ selectedDepartmentName }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToUserManage(0)">全部用户</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(1)">区团工委</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(2)">社区团组织</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(3)">高校团组织</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(4)">企业团组织</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button type="primary" @click="goToPostCheck">帖子审核</el-button>
      <el-button type="primary" @click="goToPostModify">增删帖子</el-button>
    </el-header>

    <div class="user-manage">
      <router-view></router-view>
    </div>

    <FooterNav/>
    <!-- <footer class="footer-nav">
      <el-button class="nav-btn" @click="router.push('/mob/index')">返回首页</el-button>
      <el-button class="nav-btn" @click="goToPostCheck">帖子审核</el-button>
      <el-button class="nav-btn" @click="goToPostModify">增删帖子</el-button>
    </footer> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import router from "@/router";
import {department} from "@/api/user";
import FooterNav from "@/views/moble/footer.vue";

// 部门名称映射
const departmentMap: Record<number, string> = {
  [0]: '所有用户',
  [1]: '区团工委',
  [2]: '社区团组织',
  [3]: '高校团组织',
  [4]: '企业团组织',
};

// 计算属性，获取当前选择的部门名称
const selectedDepartmentName = computed(() => {
  return departmentMap[department.value] || '用户管理';
});

// 侧边栏函数
const goToUserManage = (depId: number) => {
  router.push('/mob/manage/user-manage')
  // 根据部门选择
  department.value = depId;
}
const backToUserManage = (depId: number) => {
  if (depId == -1) {
    router.push('/mob/manage/user-manage')
    department.value = 0;
  }
}

const goToPostCheck = () => {
  router.push('/mob/manage/post-check')
  department.value = -1
}

const goToPostModify = () => {
  router.push('/mob/manage/post-modify')
  department.value = -1
}
// const goToDelRecord = () => {
//   router.push('/mob/manage/post-del-record')
// }
</script>

<style scoped lang="scss">
/* 页面主体容器样式 */
.manage-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
}

.header {
  width: 100%;
  height: 8vh;
  background: rgba(0, 130, 65, 1);
  color: white;
  text-align: center;
  padding-top: 2.5vh;
  border-bottom-left-radius: 2.5vh;
  border-bottom-right-radius: 2.5vh;
  
  /* 去除下拉菜单hover时的边框 */
  ::v-deep .el-dropdown {
    .el-button {
      &:hover, &:focus, &:active {
        border-color: transparent !important;
        outline: none !important;
        box-shadow: none !important;
      }
    } 
  }
}
</style>
