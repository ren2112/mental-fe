<template>
  <div class="background_container">
    <div class="items_container">
      <div class="head_line">
        <div class="head_box">
          <h1>视频投稿</h1>
        </div>
        <div class="head_box">
          <router-link class="post_btn style1" to="/post">视频投稿</router-link>
        </div>
        <div class="head_box">
          <router-link class="post_btn" to="/txt-img-post">图文投稿</router-link>
        </div>
        <div class="head_box">
          <button class="head_btn" @click="handlePost">立即发布</button>
        </div>
      </div>
      <div class="video_input">
        <div class="video_box">
          <div class="the_file_choose">
            <label>选择视频文件：</label>
            <label class="file-upload">
              选择文件
              <input type="file" @change="onFileChange" accept="video/*" />
            </label>
            <div class="file-name-container">
              <span class="file-name"> {{ fileName }}</span>
            </div>
          </div>
        </div>
        <div class="video_box">
          <label>选择活动分区：</label>
          <div id="app">
            <Dropdown @update:selectedIndex="updateSelectedIndex"/>
          </div>
        </div>
      </div>
      <div class="title_container">
        <input type="text" id="title_input" placeholder="请输入视频标题（最多40字）" maxlength="40" v-model="title">
      </div>
      <div class="intro_container">
        <textarea id="intro_textarea" placeholder="请输入视频简介（最多2000字）" maxlength="2000" v-model="content"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Dropdown from '../components/dropdownmenu.vue';
import { ElMessage } from 'element-plus';
import {uploadFileAPI} from '@/api/post'
// import { title } from 'process';

export default{
  name: 'App',
  components: {
    Dropdown,
  },
  setup(){
    const fileName = ref('未选择文件');
    const image = ref(null);
    const showChangeText = ref(false);
    const fileInput = ref(null);
    const title = ref(''); // 帖子标题
    const content = ref(''); // 帖子简介
    const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值

    const updateSelectedIndex = (index) => {
      selectedIndex.value = index;
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      fileName.value = file ? file.name : '未选择文件'; // 更新文件名
      fileInput.value = file ? file : null; //绑定上传文件
    };

    const onImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        image.value = URL.createObjectURL(file);
      }
    };

    // 立即发布逻辑
    const handlePost = async () => {
      // 判断上传文件和标题是否为空
      if (!fileInput.value) {
        ElMessage.warning('请上传视频文件');
        return;
      }
      if (!title.value.trim()) {
        ElMessage.warning('帖子标题不能为空');
        return;
      }
      if(!content.value.trim()){
        ElMessage.warning('贴子简介不能为空');
      }
      if (selectedIndex.value === -1) {
        ElMessage.warning('请选择一个活动分区');
        return;
      }
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', fileInput.value); // 添加文件
      formData.append('type',1);
      formData.append('title', title.value); // 添加标题
      formData.append('content', content.value); // 添加简介
      formData.append('part',selectedIndex.value);

      try {
        // 调用接口
        const response = await uploadFileAPI(formData);
        ElMessage(response.msg);
        if(response.code===0){
          setTimeout(() => {
            //window.location.reload();
          }, 1000);
        }
      } catch (error) {
        ElMessage('错误信息:', error);
      }
    };

    return{
      fileName,
      onFileChange,
      image,
      showChangeText,
      fileInput,
      title,
      content,
      onImageChange,
      handlePost,
      selectedIndex,
      updateSelectedIndex
    };
  }
}

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
  min-width: 700px;
  height: auto;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 5px 5px 5px rgba(0,0,0,0.1);
  background-color: white;
  margin-top: 5px;
  box-sizing: border-box;
}
.head_line{
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 70px;
  align-items: center;
  align-content: center;
  text-align: center;
  padding: 10px 0px;
  border-bottom: 1px solid rgba(0,130,65,1);
  margin: 10px 0px;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.video_input{
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid rgba(0,130,65,1);
  flex-wrap: wrap;
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
.head_box{
  width: 200px;    
    height: 40px;
    display: flex;
    align-items: center;    
    justify-content: center;
    flex: 1;
    margin: 5px 10px;   
}
.video_box{
  width: 350px;
  height: 40px;
  display: flex;
  align-items: center;
  align-content: center;
  text-align: center;
  flex: 1;
  margin-bottom: 5px;
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

@media (max-width: 600px) {
  .items_container {
    width: 95%; /* 小屏幕时宽度更大 */
  }
  .head_box, .video_box {
    flex: 100%; /* 在小屏幕上每个元素占满一行 */
  }
}

</style>