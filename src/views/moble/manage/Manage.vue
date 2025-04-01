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
      <el-button type="primary" @click="">发个帖子</el-button>
    </el-header>

    <div class="user-manage">
      <router-view></router-view>
    </div>

    <footer class="footer-nav">
      <el-button class="nav-btn" @click="router.push('/mob/index')">返回首页</el-button>
      <el-button class="nav-btn" @click="goToPostCheck">帖子审核</el-button>
      <el-button class="nav-btn" @click="goToPostModify">增删帖子</el-button>
    </footer>
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
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
}

.header {
  width: 100%;
  height: 60px;
  background: rgba(0, 130, 65, 1);
  color: white;
  text-align: center;
  padding-top: 20px;
  font-size: 18px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.footer-nav {
  min-width: 400px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: rgba(0, 130, 65, 1);
  padding: 10px 0;
  position: fixed;
  bottom: 0;

  .el-button {
    flex: 1;  /* 使按钮占据可用空间 */
    margin: 0 0.5rem;  /* 左右间距 */
    background: transparent;
    color: white;
    border: 0.0625rem solid rgba(0, 130, 65, 1);
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: background-color 0.3s, color 0.3s; /* 平滑过渡 */
    width: 100%;
    text-align: center;  /* 使文字居中 */
  }
}
</style>
