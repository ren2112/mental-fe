<template>
  <div class="post-page">
    <el-form :inline="true" label-position="top" class="demo-form-inline">
      <!-- 输入框容器在第一行 -->
      <div class="search-box">
        <el-form-item>
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
        </el-form-item>
      </div>
      
      <!-- 选择器容器放在第二行 -->
      <div class="select">
        <el-form-item class="label-text">
          <el-select v-model="partNum" placeholder="所有类型">
            <el-option v-for="item in partAll" :value="item.id" :key="item.id" :label="item.label" class="option">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="label-text">
          <el-select v-model="isApproved" placeholder="所有审核状态">
            <el-option v-for="item in isApprovedAll" :value="item.id" :key="item.id" :label="item.label" class="option">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>


    <!-- 表格 -->
    <el-table :data="tableData"
              :table-layout="tableLayout"
              :default-sort="{ prop: 'ID', order: 'ascending' }"
              height="60vh"
              @row-click="handleRowClick"
    >
      <!--      <el-table-column prop="Cover" label="封面" width="100">-->
      <!--        <template #default="scope">-->
      <!--          <div class="cover">-->
      <!--            <img :src="scope.row.Cover" alt="cover" class="image"/>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="Title" label="标题" sortable width="90vw">
        <template #default="scope">
          <span class="title">{{ formatContent(scope.row.Title, 15) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Content" label="简介" width="100vw">
        <template #default="scope">
          <span class="content">{{ formatContent(scope.row.Content, 20) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UserId" label="作者"  show-overflow-tooltip width="60vw"/>
      <el-table-column prop="Part" label="分类" :formatter="formatPart"  width="60vw"/>
      <el-table-column label="审核状态" width="80vw">
        <template #default="scope">
          <el-tag :type="formatIsAudit(scope.row)">{{ formatIsApproved(scope.row) }}</el-tag>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="itemTotal"
        background
        layout="prev, pager, next"
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
pageSize.value = 10;
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
  { id: 2, label: '不通过' },
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

function formatContent(content: string, maxLength: number): string {
  if (!content) return '';
  const sanitizedContent = sanitizeContent(content); // 去除 HTML 标签和转义字符
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
  await router.push({ name: 'mob-content', query: { postID: row.ID, check: 1, source: 'delete' } });
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
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;

  margin-top: 2.5vh;
  margin-bottom: 2.5vh;
  row-gap: 2.5vh;

  .el-form {
    display: flex;
    flex-direction: column;
    align-items: center;

    .search-box{
      display: flex;
      flex-direction: row;
      align-items: center;
      
      /* 修改搜索框样式 */
      .el-input {
        width: 70vw;
        --el-input-border-color: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
        border-radius: 3.5vh; /* 圆角 */
        border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
        transition: border-color 0.3s, background-color 0.3s;
      }
      ::v-deep .el-input__wrapper {
        border-radius: 3.5vh; /* 圆角 */
        box-shadow: none;
      }
      ::v-deep .el-input-group__append {
        border-radius: 3.5vh; /* 圆角 */
        border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
        transition: border-color 0.3s, background-color 0.3s;
      }
      /* 修改按钮的样式 */
      .el-button {
        right: 0;
        border-radius: 3.5vh;
        background-color: rgba(0, 130, 65, 1); /* 默认按钮背景色 */
        color: white;
        border: none;
        transition: background-color 0.3s, box-shadow 0.3s;
      }
      /* 按钮的点击样式 */
      .search-buttom:active {
        background-color: rgba(0, 130, 65, 1); /* 点击时按钮背景色 */
        box-shadow: none;
      }
    }
    

    .label-text {
      text-align: left;
      font-weight: bold;
      margin-bottom: 0px;
    }

    /* 修改选择器的样式 */
    .select {
      display: flex;
      flex-direction: row;
      align-items: center;
      .el-select {
        width: 30vw;
        font-weight: normal;
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
