<template>
    <div class="container">
        <div class="header">
            <div class="header-box">
                <h3>贴子修改</h3>
                <div class="btnbox">
                    <button class="headerbtn" @click="handlePost" >完成修改</button>
                </div>
            </div>
        </div>
        <div class="datainputcontainer">
            <div class="partchoosediv">
                <div class="partchoosebox">
                    <h4>活动分区：</h4>
                    <div class="dropdownmenuBOX">
                        <mobDropDownMenu v-model="selectedIndex" />
                    </div>
                </div>
                <div class="the_file_choose">
                    <label class="file-upload">
                        {{ fileName }}
                        <input type="file" @change="onFileChange" accept="video/*" />
                    </label>
              </div>
            </div>
            <div class="titleinputbox">
                <input type="text" id="title_input" placeholder="请输入视频标题（最多40字）" maxlength="40" v-model="title">
            </div>
            <div class="contentinputbox">
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
                    <div v-if="showPlaceholderText && !content" class="placeholder-text">
                        请输入贴子内容(最多4000字)
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterNav />
</template>
    
<script lang="ts" setup>
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import mobDropDownMenu from "../../components/moble/mobDropDownMenu.vue";  //分区选择下拉菜单栏
import { ref , onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {uploadFileAPI, getPostDetailAPI , updatePostAPI } from '@/api/post'
import { useRouter , useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const postID = route.query.postID; // 获取路由参数中的postID
const title = ref(''); // 帖子标题
const content = ref(''); // 帖子简介
const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值

const videoUrl = ref('');  //将用户上传的视频发送给服务器，服务器返回该视频在服务器中的url，后续使用这个url发布视频

// 完成修改逻辑
const handlePost = async () => {
    // 修改验证逻辑（移除了文件必传验证）
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
        let response = null
        
        const body = {
            postID: Number(postID),
            title: title.value,     
            content: content.value, 
            part: selectedIndex.value,
            cover:''
        };
        response = await updatePostAPI(body);
        

        if (response.code === 0) {
            ElMessage.success('修改成功');
            // 跳转回
            router.replace({
                path: '/mob/my-home-page', 
                query: { id: authStore.userInfo.id }
            });
        } else {
        console.log(response);
        ElMessage.error(response.msg || '修改失败');
        }
    } catch (error) {
        ElMessage.error('请求失败，请检查网络');
        console.log(error)
    }
};

// 获取帖子详情,并将数据加载到表单上
const fetchPostData = async () => {
    if (!postID) {
        ElMessage.error('无效的帖子ID');
        return;
    }
    try {
        const response = await getPostDetailAPI({ postID, token });
        const post = response.data.post;
        
        // 填充表单数据
        title.value = post.title;
        content.value = post.content;
        selectedIndex.value=post.part;
        videoUrl.value = post.video
        
        // 直接将 content 赋值给可编辑区域，保留视频和文字的原始位置
        document.getElementById("content_input").innerHTML = content.value;

    } catch (error) {
        ElMessage.error('获取帖子数据失败');
        console.log(error)
    }
};

// 组件挂载时获取数据
onMounted(() => {
    fetchPostData();
});

//下面的代码主要用户插入视频到内容
const showPlaceholderText = ref(true); // 控制是否显示 placeholder
const fileName = ref('上传视频文件');  //用户上传的文件名称，初始时没有选择文件，所以为这个名
const fileInput = ref(null);  //用户上传的文件

const onFileChange = async (event) => {  //用户上传视频触发的函数
    const file = event.target.files[0];
    if (!file) return;

    fileName.value = file.name; // 更新文件名
    fileInput.value = file; // 绑定上传文件

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await uploadFileAPI(formData);
        if (response.code === 0 && response.data?.fileUrl) {
            videoUrl.value = response.data.fileUrl;
            insertVideo(videoUrl.value);
            ElMessage.success('视频上传成功');
        } else {
            ElMessage.error(response.msg || '视频上传失败');
        }
    } catch (error) {
        ElMessage.error('上传失败，请重试');
        console.log(error)
    }
};

const insertVideo = (url) => {  //向内容（content）中插入该视频
    const editableDiv = document.getElementById("content_input");
    const videoElement = document.createElement("video");
    videoElement.src = url;
    videoElement.controls = true;
    videoElement.style.maxWidth = "90%"; 
    videoElement.style.height = "auto";  
    videoElement.style.margin = "10px 0"; 
    
    const editableParagraph = document.createElement("p");
    editableParagraph.innerHTML = "<br>"; // 兼容不同浏览器，确保可以继续输入
    editableDiv.appendChild(videoElement);
    editableDiv.appendChild(editableParagraph);

    updateContent();
};

const updateContent = () => {  //更新内容
    const editableDiv = document.getElementById('content_input');
    const rawContent = editableDiv.innerHTML.trim(); // 更新 content 为编辑框中的 HTML 内容
    content.value = rawContent === '<br>'?'':rawContent;
};

const hidePlaceholder = () => {
    showPlaceholderText.value = false;
};

const showPlaceholder = () => {
    if (!content.value.trim()) {
        showPlaceholderText.value = true;
    }
};
</script>
    
<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 400px;
        height: 100vh;
        background: white;
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
    .header-box{
        height: 50%;
        padding: 1px 5px;
        padding-left: 8px;
        align-items: center;
        display: flex;
        justify-content: space-between;
    }
    .btnbox{
        display: flex;
        gap: 20px;
        padding: 2px 5px;
    }
    .datainputcontainer{
        margin-top: 5px;
        background-color: white;
        width: 100%;
        height: auto;
        gap: 5px;
    }
    .partchoosediv{
        width: 90%;
        margin: 0 5%;
        border-bottom: 2px solid rgba(0, 130, 65, 1);
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .partchoosebox{
        width: 60%;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .dropdownmenuBOX{
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .the_file_choose{
        width: 40%;
        max-width: 210px;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .file-upload {
        display: inline-block;
        background-color: rgba(0, 130, 65, 1);
        color: white; 
        border: none;
        border-radius: 5px;
        width: 90%;  
        line-height: 30px; 
        text-align: center; 
        cursor: pointer; 
        position: relative; 
    }
    .file-upload input {
        display: none; /* 隐藏原始文件输入 */
    }
    .titleinputbox{
        width: 90%;
        height: 40px;
        margin: 0 5%;
        border-bottom: 2px solid rgba(0, 130, 65, 1);
    }
    .contentinputbox{
        width: 90%;
        margin: 0 5%;
        border-bottom: 2px solid rgba(0, 130, 65, 1);
        min-height: 300px;
        max-height: 700px;
    }
    .text_part{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        position: relative;
    }
    
    .editable-content{
        width: 100%;
        min-height: 300px;
        max-height: 700px;
        overflow-y: auto;
        line-height: 1.5;
        outline: none;
    }
    
    .placeholder-text {
        position: absolute;
        color: #aaa;
        pointer-events: none; /* 防止点击 placeholder */
        right: 50%;
    }
    #title_input{
      width: 100%;
      height: 100%;
      font-size: 1rem;
      font-weight: 600;
      outline: none;
      border: transparent;
      box-sizing: border-box;
    }
</style>