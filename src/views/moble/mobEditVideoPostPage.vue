<template>
    <div class="container">
        <div class="header">
            <div class="header-box">
                <p>贴子修改</p>
                <div class="btnbox">
                    <button class="headerbtn" @click="handlePost" >完成修改</button>
                </div>
            </div>
        </div>
        <div class="datainputcontainer">
            <div class="partchoosediv">
                <div class="partchoosebox">
                    <p>活动分区：</p>
                    <div class="dropdownmenuBOX">
                        <mobDropDownMenu v-model="selectedIndex" />
                    </div>
                </div>
            </div>
            <div class="titleinputbox">
                <input type="text" id="title_input" placeholder="请输入视频标题（最多40字）" maxlength="40" v-model="title">
            </div>
            <div class="videouploadbox">
                <p>选择视频文件：</p>
                <mobVideoUpload v-model="videofile"/>
            </div>
            <div class="contentinputbox">
                <textarea class="intro_textarea" placeholder="请输入视频简介（最多2000字）" maxlength="2000" v-model="content"></textarea>
            </div>
        </div>
    </div>
    <FooterNav />
</template>
    
<script setup>
import { ref , onMounted } from "vue";
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import mobDropDownMenu from "../../components/moble/mobDropDownMenu.vue";
import mobVideoUpload from "../../components/moble/videoUploadComponent.vue"
import { ElMessage } from "element-plus";
import { uploadFileAPI , getPostDetailAPI , updatePostAPI, publishPostAPI} from "../../api/post"
import { useRouter } from 'vue-router';
import { useRoute } from "vue-router";
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const token = authStore.token; //用户的token

const postID = route.query.postID; // 获取路由参数中的postID
const title = ref('');//贴子标题
const content = ref('');//视频贴子的简介（内容）
const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值,即分区编号
const videofile = ref(null); //视频文件
const videoURL = ref(''); //视频url
const curTab = route.query.curTab || '0';

const handlePost = async () => { //完成修改逻辑
    // 判断上传文件和标题是否为空
    if (!videofile.value) {
        ElMessage.warning('请上传视频文件');
        return;
    }
    if (!title.value.trim()) {
        ElMessage.warning('帖子标题不能为空');
        return;
    }
    if(!content.value.trim()){
        ElMessage.warning('贴子内容不能为空');
        return;
    }
    if (selectedIndex.value === -1) {
        ElMessage.warning('请选择一个活动分区');
        return;
    }

    try{
        videoURL.value = await uploadVideoFile();
        let response=null
        const body = {
            PostID: Number(postID),
            Title: title.value,     
            Content: content.value, 
            Part: selectedIndex.value,
            video:videoURL.value
        };
        if (curTab==='1'){
            response = await publishPostAPI(body);
        }else{
            response = await updatePostAPI(body);
        }

        if(response.code===0){
            ElMessage.success("修改成功！");
            setTimeout(() => {
                router.replace({
                    path: '/mob/my-home-page',
                    query: { id: authStore.userInfo.id }
                });
            }, 500);
        }
    }catch(error){
        ElMessage.error('修改出错！',error.message);
    }
};
const uploadVideoFile = async ()=>{ //上传视频返回url
    if(!videofile.value) return '';

    const formData = new FormData();
    formData.append('file',videofile.value);
    try{
        const response = await uploadFileAPI(formData);
        if(response.code === 0){
            return response.data.fileUrl;
        }else{
            throw new Error("视频上传失败");
        }
    }catch(error){
        ElMessage.error(error.message);
    }
}
// 获取帖子详情
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
        videoURL.value = post.video;

        // 初始化视频组件预览
        if (post.video) {
            try {
                const response = await fetch(post.video);
                const blob = await response.blob();
                videofile.value = new File([blob], 'video.mp4', {
                    type: blob.type || 'video/mp4'
                });
            } catch (error) {
                console.error('视频加载失败:', error);
                ElMessage.warning('视频加载失败，请重新上传');
            }
        }
    } catch (error) {
        ElMessage.error('获取帖子数据失败');
        console.log(error)
    }
};
// 组件挂载时获取数据
onMounted(() => {
    fetchPostData();
});
</script>
    
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 40vh;
    height: 100vh;
    background: white;
}
  
.header {
    width: 100%;
    height: 6vh;       /* 改为vh */
    background: rgba(0, 130, 65, 1);
    color: white;
    text-align: center;
    padding-top: 2vh;   /* 改为vh */
    font-size: 3vh;
    border-bottom-left-radius: 2vh; /* 改为vh */
    border-bottom-right-radius: 2vh; /* 改为vh */
}

.header-box {
    height: 50%;
    padding: 0.1vh 5vw;
    align-items: center;
    display: flex;
    justify-content: space-between;
}

.btnbox {
    display: flex;
    gap: 5vw;            /* 改为vw */
    padding: 0.5vw 0.5vh;
}

.headerbtn {
    padding: 0.5vw 0.5vh;
    background-color: white;
    border: transparent;
    border-radius: 0.5vh;
    color: rgba(0, 130, 65, 1);
    font-size: 1.7vh;          /* 改为rem */
    text-decoration: none;
    align-items: center;
    text-align: center;
}

.datainputcontainer {
    margin-top: 0.5vh;
    background-color: white;
    width: 100%;
    height: auto;
    gap: 0.5vh;
}

.partchoosediv {
    width: 90%;
    margin: 0 5%;
    border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
    height: 6vh;
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.partchoosebox {
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
}

.dropdownmenuBOX {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
}

.file-upload input {
    display: none;
}

.titleinputbox {
    width: 90%;
    height: 6vh;
    margin: 0 5%;
    border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
}
.videouploadbox{
    font-size: 1.5vh;
    width: 90%;
    margin: 0 5%;
    border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
    height: 12vh;
    display: flex;
}
.contentinputbox{
    width: 90%;
    margin: 0 5%;
    border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
    overflow: hidden; /* 防止内容直接溢出 */
    height: 55vh;
}
.intro_textarea{
  width: 100%;
  height: 100%;
  font-size: 1.6vh;
  font-weight: 500;
  font-family: "Helvetica Neue", Arial, sans-serif;
  resize: none;
  outline: none;
  border: transparent;
  box-sizing: border-box;
}

#title_input{
    width: 100%;
    height: 100%;
    font-size: 2.5vh;
    font-weight: 600;
    outline: none;
    border: transparent;
    box-sizing: border-box;
}
</style>