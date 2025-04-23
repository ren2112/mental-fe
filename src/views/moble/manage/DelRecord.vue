<template>
    <div class="post-check">
      <el-form :inline="true" label-position="left" class="form">
        <!-- 输入框容器 -->
        <el-form-item class="label-text">
          <div class="search-box">
            <el-input
                v-model="searchQuery"
                placeholder="按帖子内容搜索"
                clearable
                autofocus
                @keyup.enter="fetchPosts()"
            >
              <template #append>
                <el-button
                    :icon="Search"
                    @click="fetchPosts()"
                    class="search-buttom"
                />
              </template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
  
  
      <!-- 表格 -->
      <el-table :data="tableData"
                :table-layout="tableLayout"
                :default-sort="{ prop: 'ID', order: 'ascending' }"
                height="604"
                @row-click="handleRowClick"
      >
        <el-table-column prop="Cover" label="封面" width="100">
          <template #default="scope">
            <div class="cover">
              <img :src="scope.row.Cover" alt="cover" class="image"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="Title" label="标题" sortable width="220">
          <template #default="scope">
            <span class="title">{{ scope.row.Title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Content" label="简介" width="320">
          <template #default="scope">
            <span class="content">{{ formatContent(scope.row.Content) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="UserId" label="作者" sortable show-overflow-tooltip width="80"/>
        <el-table-column prop="Part" label="分类" :formatter="formatPart" sortable width="80"/>
        <el-table-column label="审核状态" width="120">
          <template>
            <el-tag type="danger">已删除</el-tag>
          </template>
        </el-table-column>
      </el-table>
  
  
      <!--分页-->
      <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :total="itemTotal"
          size="small"
          background
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
      />
    </div>
  </template>
  
  
  <script setup lang="ts">
  import {ref, watch} from 'vue'
  import {ElMessage, type TableInstance} from 'element-plus'
  import { getdelPostsAPI } from "@/api/post";
  import Post from "@/views/Post.vue";
  import router from "@/router";

  import { Search } from "@element-plus/icons-vue";

  const searchQuery = ref('');
  const pageSize = ref(0)
  const pageNum = ref(0)
  const tableData = ref([])
  const itemTotal = ref(0)
  const tableLayout = ref<TableInstance['tableLayout']>('fixed')
  
  pageSize.value = 6;
  pageNum.value = 1;

  interface Post {
    ID?: number | undefined;
    UserId?: number | undefined;
    Type?: number | undefined;
    Title?: string;
    Content?: string;
    Cover?: string;
    Video?: string;
    Part?: number | undefined;
    IsAudit?: number | null;
    CreatedAt?: string | null;
    DeletedAt?: string | null;
  }
        
  const partAll = ref([
    { id: '', label: '所有' },
    { id: 0, label: '理论学习' },
    { id: 1, label: '志愿服务' },
    { id: 2, label: '社会实践' },
    { id: 3, label: '走进高新' },
    { id: 4, label: '青年活动' },
    { id: 5, label: '青年夜校' },
  ]);
  function formatPart (row: Post) {
    const dept = partAll.value.find(d => d.id === row.Part);
    return dept ? dept.label : '未知类型';
  }
  // 规范化 Content
  function sanitizeContent(content: string): string {
    if (!content) return '';
    const doc = new DOMParser().parseFromString(content, 'text/html');
    return doc.body.textContent || '';
  }
  
  function formatContent(content: string): string {
    if (!content) return '';
    const sanitizedContent = sanitizeContent(content); // 去除 HTML 标签和转义字符
    const maxLength = 80; // 最大显示长度
    return sanitizedContent.length > maxLength ? sanitizedContent.slice(0, maxLength) + '...' : sanitizedContent;
  }
  
  
  // 表格函数
  async function fetchPosts() {
    const params = {
      pageSize: pageSize.value,
      pageNum: pageNum.value,
      searchQuery: searchQuery.value,
    }
    try {
      const response = await getdelPostsAPI(params);
      if (response.code === 0) {
        if(response.data.posts === null) {
          tableData.value = [];
          itemTotal.value = 0;
        }
        else {
          itemTotal.value = response.data.total;
          tableData.value = response.data.posts.map((post: any) => ({
            ID: post.id,
            Cover: post.cover,
            Title: post.title,
            Content: post.content,
            UserId: post.user.username,
            Type: post.type,
            Part: post.part,
            createdAt: post.created_at,
            IsAudit: post.is_audit
          }));
        }
      }
      else {
        ElMessage({
          message: response.msg || '刷新失败',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      ElMessage({
        message: "无法连接服务器",
        type: 'error',
      });
    }
  }
  
  // 跳转详情页
  async function handleRowClick(row: Post, event: Event) {
    await router.push({ name: 'content', query: {postID: row.ID, check: 1} });
  }
  
  
  // 分页
  async function handlePageChange(newPage: number) {
    pageNum.value = newPage;
    await fetchPosts();
  }
  
  watch([pageSize, pageNum], fetchPosts, { immediate: true });
  </script>
  
  <style scoped>
  .post-check {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    margin-top: 20px;
    width: 100%;
    row-gap: 40px;
  
  
    .el-form {
      gap: 10px;
      row-gap: 40px;
  
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between; /* 水平居中内容 */
  
      .label-text {
        text-align: left;
        font-weight: bold;
        margin-bottom: 0px;
      }
  
  
      .search-box {
        position: relative;
  
        /* 修改搜索框样式 */
        .el-input {
          width: 500px;
  
          --el-input-border-color: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
          border-radius: 30px; /* 圆角 */
          border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
          transition: border-color 0.3s, background-color 0.3s;
        }
        ::v-deep .el-input__wrapper {
          border-radius: 30px; /* 圆角 */
          box-shadow: none;
        }
        ::v-deep .el-input-group__append {
          border-radius: 30px; /* 圆角 */
          border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
          transition: border-color 0.3s, background-color 0.3s;
        }
  
  
        /* 修改按钮的样式 */
        .el-button {
          right: 0;
          border-radius: 30px;
          background-color: rgba(0, 130, 65, 1); /* 默认按钮背景色 */
          color: white;
          border: none;
          transition: background-color 0.3s, box-shadow 0.3s;
          &:hover {
            background-color: rgba(0, 130, 65, 0.8); /* 悬停时按钮背景色 */
            box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
          }
          &:focus {
            background-color: rgba(0, 130, 65, 1); /* 按钮聚焦时的背景色 */
            box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.2); /* 聚焦时的阴影 */
          }
          .el-icon {
            font-size: 2.5vh;
            color: white;
          }
        }
        /* 按钮的点击样式 */
        .search-buttom:active {
          background-color: rgba(0, 130, 65, 1); /* 点击时按钮背景色 */
          box-shadow: none;
        }
      }
  
  
      /* 修改选择器的样式 */
      .el-select {
        font-weight: normal;
        width: 12vh;
        border-radius: 3.5vh; /* 圆角 */
        border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
        transition: border-color 0.3s, background-color 0.3s;
        background-color: white;
      }
      ::v-deep .el-select__wrapper {
        border-radius: 3.5vh;
        border: none;
        box-shadow: none;
        &:hover {
          border: none;
          box-shadow: none;
        }
        &:focus {
          border: none;
          box-shadow: none;
        }
      }
    }
  
  
    /* 表格 */
    .el-table {
      border-radius: 1.2vh; /* 设置元素的圆角 */
  
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .el-table__body {
      align-items: flex-start; /* 确保行顶部对齐 */
      flex-grow: 1;
      width: 100%;
    }
  
  
    .title {
      font-weight: bold; /* 使标题字体加粗 */
    }
  
    .cover {
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center;     /* 垂直居中 */
      height: 100%;            /* 让容器高度填满单元格 */
  
      .image {
        width: 9vh;  /* 设置图片的宽度 */
        height: 9vh; /* 设置图片的高度 */
        object-fit: cover; /* 保持图片比例并裁剪以适应尺寸 */
        border-radius: 1vh;
        border: 1px solid rgba(0,130,65,0.3); /* 添加圆形边框 */
      }
    }
  }
  </style>
  