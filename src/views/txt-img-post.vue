<template>
  <div class="background_container">
    <div class="items_container">
      <div class="headline">
        <div class="head_box">
          <h1>图文投稿</h1>
        </div>
        <div class="head_box">
          <router-link class="post_btn" to="/post">视频投稿</router-link>
        </div>
        <div class="head_box">
          <router-link class="post_btn style1" to="/txt-img-post">图文投稿</router-link>
        </div>
        <div class="head_box">
          <button class="head_btn" @click="handlePost">立即发布</button>
        </div>
      </div>
      <div class="others_box">
        <div class="image_insert">
          <label>添加图片到内容：</label>
          <div class="image_upload_container">
            <input
                type="file"
                accept="image/*"
                ref="imageInput"
                @change="uploadImage"
                style="display: none;"
            />
            <button class="post_btn" @click="selectUploadImage">上传图片</button>
          </div>
        </div>
        <div class="type_choose">
          <label>选择活动分区：</label>
          <div id="app">
            <Dropdown @update:selectedIndex="updateSelectedIndex"/>
          </div>
        </div>
        
      </div>
      <div class="title_line">
        <input
            type="text"
            id="title_input"
            placeholder="请输入贴子标题（最多40字）"
            maxlength="40"
            v-model="title"
        />
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
      <div class="cover_box">
        <div class="cover_choose">
          <label>选择贴子封面：</label>
          <div class="cover_upload_container" @click="selectImage" @mouseover="showChangeText = true" @mouseleave="showChangeText = false">
            <input type="file" accept="image/*" ref="fileInput" @change="onImageChange" style="display: none;"/>
            <div v-if="!image" class="cover_placeholder">+ 上传贴子封面</div>
            <img v-if="image" :src="image" class="uploaded_cover"  alt=""/>
            <div v-if="image && showChangeText" class="text_for_change" @click.stop="selectImage">更改</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Dropdown from '../components/dropdownmenu.vue';
import { uploadFileAPI,publishPostAPI } from '../api/post.ts'; 
import { ElMessage } from 'element-plus';

export default {
  name: 'App',
  components: {
    Dropdown,
  },
  setup() {
    const fileName = ref('未选择文件');
    const image = ref(null);
    const showChangeText = ref(false);
    const fileInput = ref(null);
    const imageInput = ref(null);

    const title = ref(''); // 帖子标题
    const content = ref(''); // 用于管理 textarea 的内容
    const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值
    const coverFile = ref(null);
    const cover = ref('');
    
    const showPlaceholderText = ref(true); // 控制是否显示 placeholder

    const updateSelectedIndex = (index) => {
      selectedIndex.value = index;
    };

    const selectImage = () => {
      fileInput.value.click();
    };

    const onImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        coverFile.value = file;
        image.value = URL.createObjectURL(file);
      }
    };

    const selectUploadImage = () => {
      imageInput.value.click();
    };

    const uploadImage = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file); // 上传的文件
        formData.append('type',0);
        formData.append('title', ''); // 标题（可为空）
        formData.append('content', content.value); // 当前内容（可为空）
        formData.append('part', '1'); // 固定为 1

        try {
          const response = await uploadFileAPI(formData);
          if (response.code === 0) {
            const picUrl = response.data.picUrl;
            insertImage(picUrl);
          } else {
            ElMessage.error("图片上传失败");
            console.error('上传失败:', response.msg);
          }
        } catch (error) {
          ElMessage.error("图片上传出错");
          console.error('上传出错:', error);
        }
      }
    };

    const insertImage = (url) => {
      const editableDiv = document.getElementById('content_input');
      const imgElement = document.createElement('img');
      imgElement.src = url;
      imgElement.style.maxWidth = '100%'; // 自适应宽度
      imgElement.style.height = 'auto';  // 自适应高度
      imgElement.style.margin = '10px 0';  // 设置图片的上下间距

      editableDiv.appendChild(imgElement);

      updateContent();
    };



    const updateContent = () => {
      const editableDiv = document.getElementById('content_input');
      const rawContent = editableDiv.innerHTML.trim(); // 更新 content 为编辑框中的 HTML 内容
      content.value = rawContent === '<br>'?'':rawContent;
      console.log(content.value);
    };

    const hidePlaceholder = () => {
      showPlaceholderText.value = false;
    };

    const showPlaceholder = () => {
      if (!content.value.trim()) {
        showPlaceholderText.value = true;
      }
    };

    const uploadcover = async()=>{
      if(!coverFile.value){
        return '';
      }
      const formData = new FormData();
      formData.append('file',coverFile.value);
      formData.append('type',0);
      formData.append('part',selectedIndex.value);
      formData.append('coverFlag',1);
      
      try{
        const response = await uploadFileAPI(formData);
        if(response.code===0){
          cover.value = response.data.picUrl;
          return cover.value;
        }else{
          ElMessage.error(response.msg);
          throw new Error('封面上传失败！');
        }
      }catch(error){
        console.error('封面上传出错:', error);
        throw error;
      }

    }

    const handlePost = async()=>{
      if (!title.value.trim()) {
        ElMessage.warning('帖子标题不能为空');
        return;
      }
      if (!content.value.trim()) {
        ElMessage.warning('帖子内容不能为空');
        return;
      }
      if (selectedIndex.value === -1) {
        ElMessage.warning('请选择一个活动分区');
        return;
      }
      if(!coverFile.value){
        ElMessage.warning('请选择贴子封面');
        return;
      }

      try{
        cover.value = await uploadcover();

        const body = {
          title:title.value,
          content:content.value,
          part:selectedIndex.value,
          cover:cover.value
        };

        const response = await publishPostAPI(body);
        if(response.code === 0){
          ElMessage(response.msg);
          setTimeout(()=>{
            window.location.reload();
          },1000);
          
        }else{
          ElMessage(response.msg);
        }

      }catch(error){
        ElMessage.error('发布出错，请稍后重试');
        console.error('发布出错:', error);
      }

    }

    return {
      fileName,
      image,
      showChangeText,
      fileInput,
      imageInput,
      title,
      content,
      selectedIndex,
      coverFile,
      cover,
      selectImage,
      onImageChange,
      selectUploadImage,
      uploadImage,
      updateContent,
      showPlaceholderText,
      hidePlaceholder,
      showPlaceholder,
      updateSelectedIndex,
      uploadcover,
      handlePost,
    };
  },
};
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
    width: 90%;
    max-width: 930px;
    height: auto;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 5px 5px 5px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    background-color: white;
}
.others_box{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content:space-around;
    border-bottom: 1px solid rgba(0, 130, 65, 1);
    flex-wrap: wrap;
    margin: 10px 0;
}
.headline{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 130, 65, 1);
    margin: 10px 0;
}
.title_line{
    width: 100%;
    height: 60px;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
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

.editable-content {
  width: 890px;
  border: 1px solid #ccc;
  min-height: 200px;
  overflow-y: auto;
  line-height: 1.5;
}

.editable-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

.placeholder-text {
  position: absolute;
  color: #aaa;
  pointer-events: none; /* 防止点击 placeholder */
  left: 15px;
}

.cover_box{
  width: 100%;
  height: 230px;
  margin: 10px 0;
  border-bottom: 1px solid rgba(0, 130, 65, 1);
}
#content_input {
  width: 100%; 
  height: 480px; /* 设置高度 */
  font-size: 16px; /* 字体大小 */
  border: transparent; /* 边框颜色 */
  resize: none; 
  outline: none; /* 去除默认聚焦边框 */
  margin: 1px 0;
}

.head_box{
    width: auto;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    margin: 5px 10px;
}
.type_choose{
    width: auto;
    height: 45px;
    margin: 4px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.image_insert{
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 10px;
}
.cover_choose{
    width: 100%;
    height: 220px;
    margin: 5px 0;
    display: flex;
}
.cover_upload_container{
    width: 280px;
    height: 210px;
    border: 2px dashed rgb(128, 128, 128);
    position: relative;
    cursor: pointer;
    overflow: hidden;
}
.cover_placeholder{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    color: rgb(128, 128, 128);
}
.uploaded_cover{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.text_for_change{
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    color: black;
}
.post_btn{
    text-decoration: none;
    color: rgba(0,130,65,1);
    background-color: white;
    font-size: 16px;
    padding: 6px 42px;
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
    padding: 5px 42px;
    border: 1px solid rgba(0,130,65,1);
    border-radius: 3px;
    background-color: rgba(0,130,65,0.6);
    transition: background-color 0.3s;
    display: inline-block;
    margin: 5px 20px;
}
.head_btn:hover{
    background-color: rgba(0,130,65,1);
    color: white;
}
.style1{
  background-color: rgba(0,130,65,0.6);
  color: white;
}

#title_input{
    width: 100%;
    height: 50px;
    font-size: 24px;
    font-weight: 600;
    outline: none;
    border: transparent;
    border-bottom: 1px solid rgba(0,130,65,1);
    margin: 5px 0px;
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
</style>