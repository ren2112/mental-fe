<template>
    <div class="container">
        <div class="header">
            <div class="header-box">
                <h3>图文贴子发布</h3>
                <div class="btnbox">
                    <RouterLink to="/mob/videoPost" class="headerbtn">发布视频</RouterLink>
                    <button class="headerbtn" @click="handlePost">立即发布</button>
                </div>
            </div>
        </div>
        <div class="datainputcontainer">
            <div class="partchoosediv">
                <div class="partchoosebox">
                    <h4>活动分区：</h4>
                    <div class="dropdownmenuBOX">
                        <mobDropDownMenu v-model="selectedIndex"/>
                    </div>
                </div>
                <div class="uploadimgbox">
                    <input
                        type="file"
                        accept="image/*"
                        ref="contentimageInput"
                        @change="uploadImage"
                        style="display: none;"
                    />
                    <button class="uploadimgbtn" @click="selectUploadImage">插入图片到内容</button>
                </div>
            </div>
            <div class="titleinputbox">
                <input type="text" id="title_input" placeholder="请输入贴子标题（最多40字）" maxlength="40" v-model="title">
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
                    <div v-if="showPlaceholderText && !content" class="placeholder-text">请输入贴子内容(最多4000字)</div>
                </div>
            </div>
            <div class="videoinputbox">
                选择贴子封面：
                <coverUploadComponent v-model="coverFile"/>
            </div>
        </div>
    </div>
    <FooterNav />
</template>
    
<script lang="ts" setup>
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import mobDropDownMenu from "../../components/moble/mobDropDownMenu.vue";
import coverUploadComponent from "../../components/moble/coverUploadComponent.vue";
import { uploadFileAPI,publishPostAPI } from '../../api/post'; 
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref(''); // 帖子标题
const content = ref(''); // 用于管理 textarea 的内容
const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值
const coverFile = ref(null);  //封面文件
const cover = ref('');  //封面在服务器中的url

const uploadcover = async()=>{  // 上传封面图片（coverfile），然后返回该封面在服务器内的地址url
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

const handlePost = async()=>{  // 发布贴子函数
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
            cover:cover.value,
            type:0
        };

        const response = await publishPostAPI(body);
        if(response.code === 0){
            setTimeout(() => {
                ElMessage.success(response.msg);
                router.push('/mob/index'); 
            }, 1000);
        }else{
            ElMessage(response.msg);
        }

    }catch(error){
        ElMessage.error('发布出错，请稍后重试');
    }
}

//下面的代码主要用于向内容中插入图片
const contentimageInput = ref(null);
const showPlaceholderText = ref(true); // 控制是否显示内容的 placeholder

const insertImage = (url) => {  //向贴子正文区插入图片
    const editableDiv = document.getElementById('content_input');
    const imgElement = document.createElement('img');
    imgElement.src = url;
    imgElement.style.maxWidth = '100%'; // 自适应宽度
    imgElement.style.height = 'auto';  // 自适应高度
    imgElement.style.margin = '5px 0';  // 设置图片的上下间距

    editableDiv.appendChild(imgElement);

    updateContent();
};
const uploadImage = async (event) => {  //向服务器上传 要向贴子内容区插入的图片
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
                const fileUrl = response.data.fileUrl;
                insertImage(fileUrl);
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
const selectUploadImage = () => {  //选择上传的图片
    contentimageInput.value.click();
};
const updateContent = () => {  //向内容中插入图片后更新内容
    const editableDiv = document.getElementById('content_input');
    const rawContent = editableDiv.innerHTML.trim(); // 更新 content 为编辑框中的 HTML 内容
    content.value = rawContent === '<br>'?'':rawContent;
};
const hidePlaceholder = () => {  //隐藏内容中的提示文字
    showPlaceholderText.value = false;
};
const showPlaceholder = () => {  //显示内容中的提示文字
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
        min-width: 330px;
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
        gap: 10px;
        padding: 2px 5px;
    }
    .headerbtn{
        padding: 1px 3px;
        background-color: white;
        border: transparent;
        border-radius: 5px;
        color: rgba(0, 130, 65, 1);
        font-size: 1rem;
        text-decoration: none;
        align-items: center;
        text-align: center;
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
        display: flex;
        align-items: center;
    }
    .dropdownmenuBOX{
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .uploadimgbox{
        margin: 0 10px;
    }
    .uploadimgbtn{
        border: transparent;
        background-color: rgba(0, 130, 65, 1);
        color: white;
        border-radius: 5px ;
        padding: 6px 5px;
        font-size: 0.8rem;
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
        min-height: 250px;
        max-height: 600px;
    }
    .text_part{
        width: 100%;
        min-height: 250px;
        max-height: 600px;
        display: flex;
        justify-content: center;
        position: relative;
    }
    .editable-content {
        width: 100%;
        border: 1px solid #ccc;
        min-height: 250px;
        overflow-y: auto;
        line-height: 1.5;
    }
    .editable-content img {
        max-width: 90%;
        height: auto;
        margin: 10px 1px;
    }
    .placeholder-text {
        position: absolute;
        color: #aaa;
        pointer-events: none; /* 防止点击 placeholder */
        right: 50%;
    }
    #content_input {
        width: 100%; 
        height: auto; /* 设置高度 */
        font-size: 0.8rem; /* 字体大小 */
        border: transparent; /* 边框颜色 */
        resize: none; 
        outline: none; /* 去除默认聚焦边框 */
        margin: 1px 0;
    }
    .videoinputbox{
        width: 90%;
        margin: 0 5%;
        border-bottom: 2px solid rgba(0, 130, 65, 1);
        height: 100px;
        display: flex;
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