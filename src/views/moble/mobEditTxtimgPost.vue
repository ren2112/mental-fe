<template>
    <div class="container">
        <div class="header">
            <div class="header-box">
                <h3>贴子修改</h3>
                <div class="btnbox">
                    <button class="headerbtn" @click="handlePost">完成修改</button>
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
            <div class="videoinputbox">
                选择贴子封面：
                <coverUploadComponent v-model="coverFile"/>
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
        </div>
    </div>
    <FooterNav />
</template>
    
<script lang="ts" setup>
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import mobDropDownMenu from "../../components/moble/mobDropDownMenu.vue";
import coverUploadComponent from "../../components/moble/coverUploadComponent.vue";
import { uploadFileAPI, getPostDetailAPI , updatePostAPI } from '../../api/post'; 
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import type { Post } from "@/type/post";


const route = useRoute();
const authStore = useAuthStore();

const postID = ref<number>(0);  //编辑贴子需要接收贴子的ID获取贴子详情，然后更新时需要将这个一起上传
const title = ref(''); // 帖子标题
const content = ref(''); // 用于管理 textarea 的内容
const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值
const coverFile = ref<File | null>(null);  //封面文件
const cover = ref('');  //封面在服务器中的url

const uploadcover = async()=>{  // 上传封面图片（coverfile），然后返回该封面在服务器内的地址url
    if(!coverFile.value){
        return '';
    }
    const formData = new FormData();
    formData.append('file',coverFile.value);
    formData.append('type','0');
    formData.append('part',selectedIndex.value.toString());
    formData.append('coverFlag','1');
    
    try{
        const response = await uploadFileAPI(formData) as any;
        if(response.code===0){
            cover.value = response.data.fileUrl;
            return cover.value;
        }else{
            ElMessage.error(response.msg);
            throw new Error('封面上传失败！');
        }
    }catch(error){
        ElMessage.error("封面上传出错！");
        throw error;
    }
}

const isSubmitting = ref(false);//防止多次点击出错
const handlePost = async () => {
    if(isSubmitting.value){
        ElMessage.warning('贴子正在发布!')
        return;
    }
    isSubmitting.value = true;

    try{
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
        if (!coverFile.value) {
            ElMessage.warning('请选择帖子封面');
            return;
        }

        try {
            cover.value = await uploadcover();
            const body = {
                postID: postID.value,
                title:title.value,
                content:content.value,
                part:selectedIndex.value,
                cover:cover.value
            };

            const response = await updatePostAPI(body) as any;
            if(response.code === 0){
                if(authStore.userInfo){
                    ElMessage.success('修改成功');
                    router.replace({
                        path: '/mob/my-home-page',
                        query: { id: authStore.userInfo.id }
                    });
                }else{
                    ElMessage.error("本地用户信息缺失");
                }
            }else{
                ElMessage.error(response.msg || "未知错误");
            }
        } catch (error) {
            ElMessage.error('修改出错，请稍后重试');
            console.error('修改错误:', error)
        }
    }finally{
        isSubmitting.value = false;
    }
}

const fetchPostData = async (): Promise<void> => {  //根据postID获取贴子数据
    if (!postID.value) {
        ElMessage.error('无效的贴子 ID')
        return
    }

    try {
        const response = await getPostDetailAPI({
            postID: postID.value,
            token: authStore.token
        })
        // 填充数据到表单
        const postData = response.data.post as Post
        title.value = postData.title
        content.value = postData.content
        selectedIndex.value = postData.part
        cover.value = postData.cover  //封面url
        console.log(postData,1);
        

        //获取贴子封面给coverfile
        const res = await fetch(postData.cover)
        const blob = await res.blob()
        coverFile.value = new File([blob], 'cover.jpg')

        // 渲染富文本内容
        const editableDiv = document.getElementById('content_input')
        if (editableDiv) {
            editableDiv.innerHTML = postData.content || ''
        }
    } catch (error) {
        ElMessage.error("获取贴子数据失败！");
    }
}

onMounted(() => {  //在加载时赋值postID，从路由中的query中获取
    const id = route.query.postID;
    postID.value = typeof id === 'string' ? parseInt(id, 10) : 0 ;
    if (!postID.value) {
        ElMessage.error('无效的贴子 ID');
        return ; 
    }
    fetchPostData();
})

//下面的代码主要用于向内容中插入图片
const contentimageInput = ref<HTMLInputElement | null>(null);
const showPlaceholderText = ref(true); // 控制是否显示内容的 placeholder

const insertImage = (url: string) => {
  const editableDiv = document.getElementById('content_input');
  if (!editableDiv) return; // 若未找到 DOM 元素，直接返回

  const imgElement = document.createElement('img');
  imgElement.src = url;
  imgElement.style.maxWidth = '100%';
  imgElement.style.height = 'auto';
  imgElement.style.margin = '5px 0';

  editableDiv.appendChild(imgElement);
  updateContent();
};

const uploadImage = async (event:any) => {  //向服务器上传 要向贴子内容区插入的图片
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file); // 上传的文件
        formData.append('type','0');
        formData.append('title', ''); // 标题（可为空）
        formData.append('content', content.value); // 当前内容（可为空）
        formData.append('part', '1'); // 固定为 1

        try {
            const response = await uploadFileAPI(formData) as any;
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
    if(contentimageInput.value==null) return
    contentimageInput.value.click();
};
const updateContent = () => {  //向内容中插入图片后更新内容
    const editableDiv = document.getElementById('content_input');
    if(editableDiv==null){
        return 
    }
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
        min-width: 90vw;  /* 改为使用vw，响应式适配宽度 */
        height: 100vh;    /* 改为vh，适配视口高度 */
        background: white;
    }
      
    .header {
        width: 100%;
        height: 8vh;       /* 改为vh */
        background: rgba(0, 130, 65, 1);
        color: white;
        text-align: center;
        padding-top: 2vh;   /* 改为vh */
        font-size: 2rem;    /* 改为rem */
        border-bottom-left-radius: 2vh; /* 改为vh */
        border-bottom-right-radius: 2vh; /* 改为vh */
    }

    .header-box {
        height: 50%;
        padding: 0.2rem 1rem;  /* 改为rem */
        padding-left: 2rem;    /* 改为rem */
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .btnbox {
        display: flex;
        gap: 5vw;            /* 改为vw */
        padding: 0.2rem 0.5rem; /* 改为rem */
    }

    .headerbtn {
        padding: 0.3rem 1rem;    /* 改为rem */
        background-color: white;
        border: transparent;
        border-radius: 0.5rem;    /* 改为rem */
        color: rgba(0, 130, 65, 1);
        font-size: 1rem;          /* 改为rem */
        text-decoration: none;
        align-items: center;
        text-align: center;
    }

    .datainputcontainer {
        margin-top: 1vh;          /* 改为vh */
        background-color: white;
        width: 100%;
        height: auto;
        gap: 2vh;                /* 改为vh */
    }

    .partchoosediv {
        width: 90%;
        margin: 0 5%;
        border-bottom: 0.25vh solid rgba(0, 130, 65, 1); /* 改为vh */
        height: 5vh;            /* 改为vh */
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .partchoosebox {
        width: 60%;
        display: flex;
        align-items: center;
    }

    .dropdownmenuBOX {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .uploadimgbox {
        width: 40%;
        max-width: 40vw;        /* 改为vw */
        display: flex;
        align-items: center;
    }

    .uploadimgbtn {
        width: 100%;
        border: transparent;
        background-color: rgba(0, 130, 65, 1);
        color: white;
        border-radius: 0.5rem;    /* 改为rem */
        padding: 0.3rem 1rem;     /* 改为rem */
        font-size: 1rem;          /* 改为rem */
    }

    .titleinputbox {
        width: 90%;
        height: 6vh;            /* 改为vh */
        margin: 0 5%;
        border-bottom: 0.25vh solid rgba(0, 130, 65, 1); /* 改为vh */
    }

    .contentinputbox{
        width: 90%;
        margin: 0 5%;
        border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
        overflow: hidden; /* 防止内容直接溢出 */
        max-height: 55vh;
    }
    .text_part{
        width: 100%;
        min-height: 40vh;
        max-height: 70vh;
        display: flex;
        justify-content: center;
        position: relative;
    }
    .editable-content {
        width: 100%;
        border: 0.1vh solid #ccc;
        min-height: 40vh;
        overflow-y: auto;
        line-height: 1.5;
    }
    .editable-content img {
        max-width: 90%;
        height: auto;
        margin: 2vh 1vw;
    }
    .placeholder-text {
        position: absolute;
        color: #aaa;
        pointer-events: none;
        right: 50%;
    }
    #content_input {
        width: 100%; 
        height: auto;
        font-size: 0.8rem;
        border: transparent;
        resize: none; 
        outline: none;
        margin: 0.2vh 0;
    }
    .videoinputbox{
        width: 90%;
        margin: 0 5%;
        border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
        height: 15vh;
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