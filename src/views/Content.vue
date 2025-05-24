<template>
  <div class="container">
    <div class="card">
      <div class="author-section">
        <div class="author-detail" @click="navigateToProfile">
          <img class="author-avatar" :src="author.avatar" alt="author-avatar" />
          <div class="author-name">{{ author.name }}</div>
        </div>

        <!-- 帖子创建日期 -->
        <div v-if="article.createAt" class="article-created-at">
          <!-- 只有是作者本人查看时才显示修改贴子的按钮 -->
           <div class="top-buttons">
             <button v-if="isCurrentUser" class="modify-post-btn" @click="toModifyPost">修改贴子</button>
             <el-popconfirm v-if="isCurrentUser&&curTab!=='1'" @confirm="delPost" title="请确认是否要删除帖子?">
               <template #reference>
                 <button class="modify-del-btn">删除贴子</button>
               </template>
             </el-popconfirm>
           </div>
          <span>分区: {{ partMap[article.part] }}</span>
          <span style="margin-left: 16px;">创建于: {{ formattedCreateAt }}</span>
        </div>
      </div>

      <div class="article-section">
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 显示封面图片 -->
        <div v-if="article.cover&&!article.video" class="article-cover">
          <img :src="article.cover" alt="cover" class="cover-image" />
        </div>

        <!-- 视频部分 -->
        <div v-if="article.video" class="article-video">
          <video controls :src="article.video" class="video-player"></video>
        </div>

        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content"></div>
      </div>

      <!-- 根据页面来源决定显示哪些按钮 -->
      <div class="footer" v-if="check">
        <!-- 返回按钮 -->
        <el-button type="info" @click="goBack">
          返回
        </el-button>

        <!-- 如果是从删除页面跳转过来，显示删除按钮 -->
        <el-button type="danger" plain @click="deletePost" v-if="isDeletePage">
          删除
        </el-button>

        <!-- 如果是从审批页面跳转过来，显示审批按钮 -->
        <el-button type="danger" plain @click="approvePost(2)" v-if="ischeck">
          不批准
        </el-button>
        <el-button type="success" @click="approvePost(1)" v-if="ischeck">
          批准
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPostDetailAPI, deletePostAPI, approvePostAPI, delSelfPostAPI } from '@/api/post';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from "element-plus";

const author = ref({
  avatar: '',
  name: '',
  id: 0,
});
const authStore = useAuthStore();
const token = authStore.token;
const route = useRoute();
const check = route.query.check;
const source = route.query.source;  // 获取 source 参数，值为 'delete'
const curTab = route.query.curTab || 0

// 获取当前用户信息
const currentUser = authStore.userInfo; // 假设当前用户信息存储在 authStore 中

const isCurrentUser = computed(() =>{ 
  if(currentUser==null){
    return false
  }
  return currentUser.id == author.value.id;
}); // 判断是否是作者本人

const article = ref({
  id: undefined,
  title: '',
  content: '',
  video: '',
  cover: '',  // 新增封面字段
  part: 0,
  createAt: '', // 新增创建时间字段
});

const partMap: { [key: number]: string } = {
  0: '理论学习',
  1: '走进高新',
  2: '青年活动',
  3: '青年夜校',
  4: '志愿服务',
  5: '社会实践',
};

// 判断当前页面是否从删除页面跳转过来
const isDeletePage = source === 'delete';
const ischeck = source === 'check';

// 获取帖子数据
const fetchPostData = async () => {
  const postID = route.query.postID; // 从查询参数获取 postID
  if (!postID) {
    console.error('未提供帖子 ID');
    return;
  }

  const response = await getPostDetailAPI({ postID, token });
  const post = response.data.post;

  author.value = {
    avatar: post.user.avatar,
    name: post.user.username,
    id: post.user.id
  };

  article.value = {
    id: post.id,
    title: post.title,
    content: post.content,
    video: post.video,
    cover: post.cover, // 从后台获取封面
    createAt: post.created_at, // 从后台获取创建时间
    part: post.part
  };
};

const navigateToProfile=async()=>{
  await router.push({ name: 'my-home-page', query: { id:author.value.id } });
}

// 审批帖子
async function approvePost(ifApprove: number) {
  const data = {
    postID: article.value.id,
    action: ifApprove,
  };
  try {
    console.log(data);
    const response = await approvePostAPI(data) as any;
    console.log(response);
    if (response.code === 0) {
      await router.push('/manage/post-check');
      ElMessage({
        message: '审批成功',
        type: 'success'
      });
    } else {
      ElMessage({
        message: response.msg || '审批失败',
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

// 返回到之前的页面
function goBack() {
  if (isDeletePage) {
    router.push('/manage/post-modify'); // 返回到删除帖子页面
  } else if(ischeck){
    router.push('/manage/post-check'); // 返回到审批页面
  }else if(check === '1'){
    router.push('manage/post-del-record')
  }else{
    router.push('/index')
  }
}

async function deletePost() {   //删除贴子
  const postID = article.value.id; // 获取当前帖子的 ID
  if (!postID) {
    ElMessage({
      message: "帖子 ID 不存在",
      type: 'error',
    });
    return;
  }

  try {
    // 调用删除帖子接口
    const response = await deletePostAPI(postID) as any;

    if (response.code === 0) {
      // 删除成功后显示成功信息
      ElMessage({
        message: response.msg || '删除成功',
        type: 'success',
      });
      // 删除成功后跳转到删除帖子页面
      router.push('/manage/post-modify');
    } else {
      // 删除失败时显示错误信息
      ElMessage({
        message: response.msg || '删除失败',
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    // 连接错误时显示提示
    ElMessage({
      message: "无法连接服务器",
      type: 'error',
    });
  }
}


// 格式化创建时间
const formattedCreateAt = computed(() => {
  if (!article.value.createAt) return '';
  const date = new Date(article.value.createAt);
  return date.toLocaleDateString(); // 根据需要可以调整日期格式
});

async function delPost(){
  const postID = article.value.id; // 获取当前帖子的 ID
  if(!postID){
    ElMessage.error('帖子ID不存在')
  }
  const res = await delSelfPostAPI(postID as any) as any
  if(res.code === 0){
    ElMessage.success(res.msg)
    router.push('/index')
  }else{
    ElMessage.warning(res.msg)
  }
}



const toModifyPost = () => {  //跳转到贴子修改页面
  if(article.value.video){  //如果视频不为空则跳转到视频贴子修改页，否则跳转到图文贴子修改页
    router.push({     
      name: 'edit-video-post',
      query: {  // 使用 query 传递参数
        postID: article.value.id,
        // 可以携带其他必要参数（如来源页面）
        source: 'detail' ,
        curTab: curTab
      }
    });
  }else{
    router.push({
      name: 'edit-txt-img-post',
      query: {  // 使用 query 传递参数
        postID: article.value.id,
        // 可以携带其他必要参数（如来源页面）
        source: 'detail' ,
        curTab: curTab
      }
    });
  }
}

onMounted(async () => {
  await fetchPostData();
});
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.author-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.author-detail {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
}

.author-name {
  font-size: 18px;
  font-weight: bold;
}

.article-section {
  margin-top: 10px;
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.article-video {
  margin-bottom: 30px;
}

.video-player {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.article-content {
  margin-bottom: 20px;
  word-break: break-all; /* 强制所有字符换行（包括长单词/字符） */
  overflow-wrap: break-word; /* 优先在单词内换行 */
  white-space: pre-wrap; /* 保留空格和换行符 */
  /* text-align: center;  */
  /* 确保所有在内容区域的图片居中 */
}

.article-cover {
  margin-bottom: 20px;
  display: flex;
  justify-content: center; /* 确保图片居中 */
}

.cover-image {
  max-width: 100%; /* 设置最大宽度为 80%，可以根据需要调整 */
  height: auto; /* 保持图片的纵横比 */
}

.modify-post-btn{
  margin: 0px 20px;
  padding: 5px 10px;
  background-color: rgba(0,130,65,1);
  border: 1px solid rgba(0,130,65,1);
  border-radius: 3px;
  color: white;
  transition: background-color 0.3s;
}
.modify-del-btn{
  margin-right: 20px;
  padding: 5px 10px;
  background-color: orange;
  border: 1px solid orange;
  border-radius: 3px;
  color: white;
  transition: background-color 0.3s;
}
.modify-post-btn:hover{
  background-color: rgba(0,130,65,0.7);
}
.modify-del-btn:hover{
  background-color: rgba(255,165,0,0.7);
}

.article-created-at {
  /* margin-top: 20px; */
  font-size: 14px;
  color: #888;
}

.footer {
  display: flex; /* 使用 Flexbox */
  justify-content: center; /* 水平居中内容 */
  align-items: center; /* 垂直居中内容 */
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.top-buttons{
  margin-bottom: 5px;
}
</style>
