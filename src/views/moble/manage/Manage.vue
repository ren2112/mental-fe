<template>
  <div class="manage-page">
    <!--  head  -->
    <el-header class="header">
      <el-dropdown split-button type="primary" @click.stop="goToUserManage(-1)">
        用户管理
<!--        <el-button type="primary"  @click.stop="goToUserManage(-1)">-->
<!--          用户管理 <el-icon class="el-icon&#45;&#45;right"><arrow-down/></el-icon>-->
<!--        </el-button>-->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToUserManage(0)">区团工委</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(1)">社区团组织</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(2)">高校团组织</el-dropdown-item>
            <el-dropdown-item @click="goToUserManage(3)">企业团组织</el-dropdown-item>
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
import router from "@/router";
import {department} from "@/api/user";
import FooterNav from "@/views/moble/footer.vue";


// 侧边栏函数
const goToUserManage = (Department: number) => {
  router.push('/mob/manage/user-manage')
  // 根据部门选择
  department.value = Department;
}

const goToPostCheck = () => {
  router.push('/mob/manage/post-check')
}

const goToPostModify = () => {
  router.push('/mob/manage/post-modify')
}
const goToDelRecord = () => {
  router.push('/mob/manage/post-del-record')
}
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
