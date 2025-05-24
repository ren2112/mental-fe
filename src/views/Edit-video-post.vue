<template>
    <div class="background_container">
      <div class="items_container">
        <div class="video_input">
          <div class="video_box">
            <span>选择活动分区：</span>
            <div id="app">
              <Dropdown 
                :defaultSelected="selectedIndex"
                @update:selectedIndex="updateSelectedIndex"
              />
            </div>
          </div>
          <div class="head_box">
            <button class="head_btn" @click="handlePost">完成修改</button>
          </div>
        </div>
        <div class="the_file_choose">
          <label class="file-upload">
            上传新视频
            <input type="file" accept="video/*" @change="onFileChange">
          </label>
          <div class="file-name-container">{{ fileName }}</div>
        </div>
        <div class="title_container">
          <input type="text" id="title_input" placeholder="请输入视频标题（最多40字）" maxlength="40" v-model="title">
        </div>
        <!-- <div class="intro_container">
          <textarea id="intro_textarea" placeholder="请输入视频简介（最多2000字）" maxlength="2000" v-model="content"></textarea>
        </div> -->
        <div v-if="video" class="video_preview_container">
          <video :src="video" controls class="video_preview"></video>
        </div>
          <div class="text_part">
            <div 
              id="content_input"
              contenteditable="true" 
              class="editable-content"
              maxlength="4000"
              @input="updateContent"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
            ></div>
            <div 
              v-if="showPlaceholderText && !content" 
              class="placeholder-text"
            >
              请输入贴子内容(最多4000字)
            </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import Dropdown from '../components/dropdownmenu.vue';
import { useAuthStore } from '@/stores/auth';
import { updatePostAPI, getPostDetailAPI, uploadFileAPI, publishPostAPI } from '@/api/post';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const token = authStore.token;

const postID = route.query.postID;
const curTab = route.query.curTab || '0';

const title = ref('');
const content = ref('');
const selectedIndex = ref(-1);
const showPlaceholderText = ref(true);
const video = ref('');
const fileName = ref('');

const updateSelectedIndex = (index) => {
  selectedIndex.value = index;
};

const updateContent = () => {
  const editableDiv = document.getElementById('content_input');
  const rawContent = editableDiv.innerHTML.trim();
  content.value = rawContent === '<br>' ? '' : rawContent;
};

const hidePlaceholder = () => {
  showPlaceholderText.value = false;
};

const showPlaceholder = () => {
  if (!content.value.trim()) {
    showPlaceholderText.value = true;
  }
};

// 视频上传处理
const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  fileName.value = file.name;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await uploadFileAPI(formData);
    if (res.code === 0) {
      video.value = res.data.fileUrl;
      ElMessage.success('视频上传成功');
    } else {
      ElMessage.error(res.msg || '视频上传失败');
    }
  } catch (error) {
    ElMessage.error('视频上传请求失败');
    console.error(error);
  }
};

// 提交帖子（新发 or 修改）
const handlePost = async () => {
  if (!title.value.trim()) {
    ElMessage.warning('帖子标题不能为空');
    return;
  }
  if (!content.value.trim()) {
    ElMessage.warning('帖子简介不能为空');
    return;
  }
  if (selectedIndex.value === -1) {
    ElMessage.warning('请选择活动分区');
    return;
  }

  try {
    let response = null;

    if (curTab === '1') {
      const params = {
        type: 1,
        part: selectedIndex.value,
        title: title.value,
        content: content.value,
        video: video.value,
      };
      response = await publishPostAPI(params);
    } else {
      const body = {
        PostID: Number(postID),
        Title: title.value,
        Content: content.value,
        Part: selectedIndex.value,
      };
      response = await updatePostAPI(body);
    }

    if (response.code === 0) {
      ElMessage.success('修改成功');
      router.replace({
        name: 'my-home-page',
        query: { id: authStore.userInfo.id }
      });
    } else {
      ElMessage.error(response.msg || '修改失败');
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查网络');
    console.error(error);
  }
};

// 获取帖子详情
const fetchPostData = async () => {
  if (!postID) {
    ElMessage.error('无效的帖子ID');
    return;
  }

  try {
    const response = await getPostDetailAPI({ postID, token });
    const post = response.data.post;

    title.value = post.title;
    content.value = post.content;
    selectedIndex.value = post.part;
    video.value = post.video;

    document.getElementById("content_input").innerHTML = content.value;
  } catch (error) {
    ElMessage.error('获取帖子数据失败');
    console.error(error);
  }
};

onMounted(async () => {
  await fetchPostData();
});
</script>


  
<style scoped>
  .background_container{
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .items_container{
    width: 94%;
    max-width: 950px;
    height: auto;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 5px 5px 5px rgba(0,0,0,0.1);
    background-color: white;
    margin-top: 5px;
    box-sizing: border-box;
  }
  .video_input{
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid rgba(0,130,65,1);
    flex-wrap: nowrap;
    margin: 10px 0;
  }
  
  .title_container{
    width: 100%;
    height: 60px;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(0,130,65,1);
    margin: 5px 0px;
    display: flex;
    flex-direction: column;
  }
  .intro_container{
    width: 100%;
    height: 600px;
    border-bottom: 1px solid rgba(0,130,65,1);
    margin: 5px 1px;
    display: flex;
    flex-direction: column;
  }
  
  .video_box{
    width: 350px;
    height: 40px;
    display: flex;
    align-items: center;
    align-content: center;
    text-align: center;
    margin-bottom: 5px;
  }
  .head_box{
      width: 160px;    
      height: 40px;
      display: flex;
      align-items: center;    
      justify-content: center;
      margin: 5px 10px;   
  }
  .post_btn{
    text-decoration: none;
    color: rgba(0,130,65,1);
    background-color: white;
    font-size: 16px;
    width: auto;
    padding: 6px 40px;
    border: 1px solid rgba(0,130,65,1);
    border-radius: 4px;
    transition: background-color 0.3s;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }
  .post_btn:hover{
    background-color: rgba(0,130,65,1);
    color: white;
  }
  .head_btn{
    width: auto;
    height: 35px;
    font-size: 16px;
    color: white;
    padding: 6px 42px;
    border: 1px solid rgba(0,130,65,1);
    border-radius: 3px;
    background-color: rgba(0,130,65,0.6);
    transition: background-color 0.3s;
    white-space: nowrap;
    display: inline-block;
    margin: 5px 10px;
  }
  .head_btn:hover{
    background-color: rgba(0,130,65,1);
    color: white;
  }
  .style1{
    background-color: rgba(0,130,65,0.6);
    color: white;
  }
  .the_file_choose{
    width: 350px;
    height: 30px;
    display: flex;
    align-items: center;
    margin: 5px 5px;
  }
  .file-upload {
    display: inline-block;
    background-color: white;
    transition: background-color 0.3s;
    color: rgba(0,130,65,1); 
    border: 1px solid rgba(0,130,65,1);
    border-radius: 5px;
    width: 100px; 
    height: 30px; 
    line-height: 30px; 
    text-align: center; 
    cursor: pointer; 
    position: relative; 
    margin: 2px 20px ;
  }
  .file-upload:hover{
    background-color: rgba(0,130,65,1);
    color: white;
  }
  .file-upload input {
    display: none; /* 隐藏原始文件输入 */
  }
  .file-name-container{
    width: 60px; /* 需要指定宽度 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #title_input{
    width: 100%;
    height: 50px;
    font-size: 24px;
    font-weight: 600;
    outline: none;
    border: transparent;
    margin: 5px 10px;
    box-sizing: border-box;
  }
  #intro_textarea{
    width: calc(100%-10px);
    max-width: 900px;
    height: 480px;
    font-size: 16px;
    resize: none;
    outline: none;
    border: transparent;
    margin: 1px 10px;
    box-sizing: border-box;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 5px;
    width: 200px;
  }
  
  h1{
    color: rgba(0,130,65,1);
  }

  .text_part{
    width: 100%;
    height: 520px;
    border-bottom: 1px solid rgba(0, 130, 65, 1);
    margin: 5px 0;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .editable-content{
    width: 100%;
    border: 1px solid #ccc;
    min-height: 200px;
    overflow-y: auto;
    line-height: 1.5;
  }

  .placeholder-text {
    position: absolute;
    color: #aaa;
    pointer-events: none; /* 防止点击 placeholder */
    top: 10px;
    left: 15px;
  }
  
  @media (max-width: 600px) {
    .items_container {
      width: 95%; /* 小屏幕时宽度更大 */
    }
    .head_box, .video_box {
      flex: 100%; /* 在小屏幕上每个元素占满一行 */
    }
  }
  .video_preview_container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.video_preview {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}
  
</style>