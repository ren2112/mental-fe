<template>
  <div class="manage-page">
    <!--  侧边栏 -->
    <div class="sidebar">
      <div class="filter-box">
        <div class="filter-title">管理系统</div>
        <el-menu
            default-active="1"
            :default-openeds="['1']"
            class="el-menu-vertical-demo"
        >
          <el-sub-menu index="1">
            <template #title>
              <div class="sub-menu-title" @click.stop="goToUserManage(-1)">
                用户管理
              </div>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="goToUserManage(0)">区团工委</el-menu-item>
              <el-menu-item index="1-2" @click="goToUserManage(1)">社区团组织</el-menu-item>
              <el-menu-item index="1-3" @click="goToUserManage(2)">高校团组织</el-menu-item>
              <el-menu-item index="1-4" @click="goToUserManage(3)">企业团组织</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="2" @click="goToPostCheck">
            <template #title>
              帖子审核
            </template>
          </el-menu-item>
          <el-menu-item index="3" @click="goToPostModify">
            <template #title>
              增删帖子
            </template>
          </el-menu-item>
          <!-- <el-menu-item index="4" @click="goToDelRecord">
            <template #title>
              删帖记录
            </template>
          </el-menu-item> -->
        </el-menu>
      </div>
    </div>

    <div class="user-manage">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import {department} from "@/api/user";


// 侧边栏函数
const goToUserManage = (Department: number) => {
  router.push('/manage/user-manage')
  // 根据部门选择
  department.value = Department;
}

const goToPostCheck = () => {
  router.push('/manage/post-check')
}

const goToPostModify = () => {
  router.push('/manage/post-modify')
}
const goToDelRecord = () => {
  router.push('/manage/post-del-record')
}
</script>

<style scoped lang="scss">
/* 页面主体容器样式 */
.manage-page {
  display: flex; /* 使用 Flex 布局，子元素水平排列 */
  gap: 40px; /* 子元素之间的间距 */
  width: 100%;
  height: 100%;
}

/* 侧边栏样式 */
.sidebar {
  width: 268px; /* 固定宽度 */
  height: 760px;
  flex-shrink: 0; /* 防止在 Flex 布局中被压缩 */
  position: sticky; /* 滚动时固定位置 */
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  margin-top: 10px;


  .filter-box {
    background: #fff; /* 背景颜色为白色 */
    padding: 16px; /* 内边距 */
    border-radius: 8px; /* 圆角边框 */
    flex:1; /* 占据剩余空间 */
    margin-top: 10px;

    .filter-title {
      font-weight: bold;
      margin-bottom: 15px;
      margin-left: 10px;
      color: rgba(0,130,65,1);
    }

    .filter-options {
      gap: 10px; /* 按钮间距 */
    }
  }

  .el-menu{
    font-weight: bold;
    border: 1px solid rgba(0,130,65,0.3);
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    border-radius: 8px; /* 圆角 */

    .el-menu-item {
      font-weight: bold;
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 鼠标悬停阴影加深 */
        border-radius: 8px; /* 圆角 */
      }
    }
  }
}

.user-manage{
  flex: 1;
}
</style>
