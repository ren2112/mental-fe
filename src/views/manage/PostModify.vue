<template>
  <div class="post-page">
<!--    <div class="search-container">-->
<!--      <div class="status-label">已发布</div>-->
<!--    </div>-->


    <el-form :inline="true" label-position="left" class="form">
      <!-- 选择器容器 -->
      <el-form-item label="类型" class="label-text">
        <el-select v-model="partNum" placeholder="所有">
          <el-option v-for="item in partAll" :value="item.id" :key="item.id" :label="item.label" class="option">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" class="label-text">
        <el-select v-model="isApproved" placeholder="所有" style="width: 120px">
          <el-option v-for="item in isApprovedAll" :value="item.id" :key="item.id" :label="item.label" class="option">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 输入框容器 -->
      <el-form-item class="label-text">
        <div class="search-box">
          <el-input
              v-model="inputSearch"
              placeholder="按标题和简介搜索"
              clearable
              autofocus
              @keyup.enter="onSearchPost(inputSearch, isApproved)"
          >
            <template #append>
              <el-button
                  :icon="Search"
                  @click="onSearchPost(inputSearch, isApproved)"
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
        <template #default="scope">
          <el-tag :type="formatIsAudit(scope.row)">{{ formatIsApproved(scope.row) }}</el-tag>
        </template>
      </el-table-column>
    </el-table>


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
import {
  onMounted,
  ref, watch,
} from 'vue'
import {ElMessage, type TableInstance} from 'element-plus'
import {
  getUnapprovedPostsAPI
} from "@/api/post";
import Post from "@/views/Post.vue";
import router from "@/router";
import {
  pageSize,
  pageNum,
  tableData,
  typeAll,
  typeSearch,
  inputSearch, onSearchPost, itemTotal, partNum
} from "@/stores/search"
import {Search} from "@element-plus/icons-vue";


/**
 * 常/变量（const/let）的定义
 */
// 外部导入
tableData.value = []
inputSearch.value = ''
// typeSearch.value = 'Title'
// typeAll.value = [
//   { id: 'ID', label: '帖号'},
//   { id: 'Title', label: '标题'},
//   { id: 'UserId', label: '作者'},
// ]
pageSize.value = 6;
pageNum.value = 1;
itemTotal.value = 0;
partNum.value = '';

const tableLayout = ref<TableInstance['tableLayout']>('fixed');
const partAll = ref([
  { id: '', label: '所有' },
  { id: 0, label: '理论学习' },
  { id: 1, label: '志愿服务' },
  { id: 2, label: '社会实践' },
  { id: 3, label: '走进高新' },
  { id: 4, label: '青年活动' },
  { id: 5, label: '青年夜校' },
]);
const isApproved = ref(0)
const isApprovedAll = ref<Array<{ id: number, label: string }>>([
  { id: 0, label: '未审批' },
  { id: 1, label: '已审批' },
  { id: 2, label: '审批不通过' },
])

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


/**
 * 函数
 */
function formatPart(row: Post) {
  const dept = partAll.value.find(d => d.id === row.Part);
  return dept ? dept.label : '未知类型';
}

function formatIsApproved(row: Post) {
  const app = isApprovedAll.value.find(d => d.id === row.IsAudit);
  return app ? app.label : '未知';
}

function formatIsAudit (row: Post) {
  if (row.IsAudit === 0) return "warning";
  else if (row.IsAudit === 1) return "success";
  else if (row.IsAudit === 2) return "error";
  else return "info";
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
  const data = {
    pageSize: pageSize.value,
    pageNum: pageNum.value,
    isApproved: isApproved.value,
    part: partNum.value,
  }
  try {
    console.log(data);
    const response = await getUnapprovedPostsAPI(data) as any;
    console.log(response);

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


// 分页
async function handlePageChange(newPage : number) {
  pageNum.value = newPage;
  await fetchPosts();
}


// 跳转详情页并传递参数
const handleRowClick = async(row: Post, event: Event) =>{
  // 这里传递了 postID 和 check 参数，以及新增的 source 参数
  await router.push({ name: 'content', query: { postID: row.ID, check: 1, source: 'delete' } });
}


// // 页面挂载时加载数据
// onMounted(async () => {
//   await fetchPosts();
// });
// 监听依赖项变化时加载数据
watch([pageSize, pageNum, partNum, isApproved], fetchPosts, { immediate: true });
</script>


<style scoped>
.post-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-top: 20px;
  width: 100%;
  row-gap: 20px;


  .el-form {
    gap: 10px; /* 统一间距 */
    width: 100%;
    max-width: 800px; /* 限制最大宽度 */
    margin: 0 auto; /* 居中 */
    display: flex;
    flex-wrap: wrap; /* 允许换行 */
    flex-direction: row;
    align-items: center;
    justify-content: center; /* 修改为居中 */

    .label-text {
      text-align: left;
      font-weight: bold;
      margin-bottom: 0;
      white-space: nowrap; /* 防止文字换行 */
      display: flex;
      align-items: center;
      margin-right: 5px; /* 加一点间距 */
    }


    .search-box {
      position: relative;
      flex: 1;
      min-width: 150px; /* 为搜索框设置最小宽度 */
      display: flex;
      justify-content: center;

      /* 修改搜索框样式 */
      .el-input {
        width: 100%;
        max-width: 500px;

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
        border: none;
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
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
        }
        &:focus {
          background-color: rgba(0, 130, 65, 1); /* 按钮聚焦时的背景色 */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 聚焦时的阴影 */
        }
        .el-icon {
          font-size: 20px;
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
      /* width: 90px; 减小宽度 */
      min-width: 100px; /* 最小宽度 */
      border-radius: 30px; /* 圆角 */
      border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
      transition: border-color 0.3s, background-color 0.3s;
      background-color: white;
      margin: 0 5px; /* 增加水平间距 */
    }
    ::v-deep .el-select__wrapper {
      border-radius: 30px;
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
    border-radius: 10px; /* 设置元素的圆角 */
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-top: 10px; /* 增加与表单的距离 */
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
      width: 75px;  /* 设置图片的宽度 */
      height: 75px; /* 设置图片的高度 */
      object-fit: cover; /* 保持图片比例并裁剪以适应尺寸 */
      border-radius: 8px;
      border: 1px solid rgba(0,130,65,0.3); /* 添加圆形边框 */
    }
  }
}
</style>
